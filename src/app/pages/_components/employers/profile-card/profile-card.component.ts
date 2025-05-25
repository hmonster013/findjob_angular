import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeService } from '../../../../_services/resume.service';
import { ToastrService } from 'ngx-toastr';
import { ProfileSearchComponent } from '../profile-search/profile-search.component';
import { JobSeekerProfileComponent } from '../../../../_components/job-seeker-profile/job-seeker-profile.component';
import { NoDataCardComponent } from '../../../../_components/no-data-card/no-data-card.component';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProfileSearchComponent,
    JobSeekerProfileComponent,
    NoDataCardComponent
  ],
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent implements OnInit {
  page: number = 1;
  pageSize: number = 10;
  count: number = 0;
  isLoading: boolean = false;
  resumes: any[] = [];
  resumeFilter: any = {};
  keyword: string = '';
  city: string = '';
  cities: any[] = [
    { value: '', label: 'Tỉnh/Thành phố' },
    { value: 'Hà Nội', label: 'Hà Nội' },
    { value: 'Hồ Chí Minh', label: 'Hồ Chí Minh' },
    { value: 'Đà Nẵng', label: 'Đà Nẵng' }
  ];

  constructor(
    private resumeService: ResumeService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchResumes();
  }

  fetchResumes() {
    this.isLoading = true;
    const params = {
      ...this.resumeFilter,
      keyword: this.keyword,
      city: this.city,
      page: this.page,
      pageSize: this.pageSize
    };

    this.resumeService.getResumes(params).subscribe({
      next: (res) => {
        this.count = res.data?.count || 0;
        this.resumes = res.data?.results || [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        Swal.fire({
          title: 'Lỗi',
          text: 'Không thể load danh sách hồ sơ',
          icon: 'error',
          confirmButtonText: 'Đóng',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700'
          }
        });
      }
    });
  }

  confirmSave(resume: any) {
    const action = resume.isSaved ? 'Hủy lưu' : 'Lưu';
    Swal.fire({
      title: `${action} hồ sơ?`,
      text: `Bạn có chắc muốn ${action.toLowerCase()} hồ sơ này?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: action,
      cancelButtonText: 'Hủy',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700',
        cancelButton: 'bg-orange-200 text-orange-800 px-4 py-2 rounded-md hover:bg-orange-300 mr-2'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.onSave(resume.slug);
      }
    });
  }

  onSave(slug: string) {
    this.resumeService.saveResume(slug).subscribe({
      next: (res) => {
        const isSaved = res.data?.isSaved;
        this.resumes = this.resumes.map((r) =>
          r.slug === slug ? { ...r, isSaved } : r
        );
        this.toastr.success(isSaved ? 'Lưu thành công' : 'Hủy lưu thành công');
      },
      error: () => {
        Swal.fire({
          title: 'Lỗi',
          text: 'Không thể lưu hồ sơ',
          icon: 'error',
          confirmButtonText: 'Đóng',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700'
          }
        });
      }
    });
  }

  onChangePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages()) {
      this.page = newPage;
      this.fetchResumes();
    }
  }

  onChangePageSize(event: Event) {
    const target = event.target as HTMLSelectElement;
    const size = +target.value;
    this.pageSize = size;
    this.page = 1;
    this.fetchResumes();
  }

  onSearch(filter: any) {
    this.resumeFilter = { ...this.resumeFilter, ...filter };
    this.page = 1;
    this.fetchResumes();
  }

  onReset() {
    this.resumeFilter = {};
    this.keyword = '';
    this.city = '';
    this.page = 1;
    this.pageSize = 10;
    this.fetchResumes();
  }

  totalPages(): number {
    return Math.ceil(this.count / this.pageSize) || 1;
  }

  getPageNumbers(): number[] {
    const total = this.totalPages();
    const maxPagesToShow = 5;
    const pages: number[] = [];
    let startPage = Math.max(1, this.page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(total, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
}

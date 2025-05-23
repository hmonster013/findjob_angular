import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeService } from '../../../../_services/resume.service';
import { ToastrService } from 'ngx-toastr';
import { ProfileSearchComponent } from '../profile-search/profile-search.component';
import { JobSeekerProfileComponent } from '../../../../_components/job-seeker-profile/job-seeker-profile.component';
import { NoDataCardComponent } from '../../../../_components/no-data-card/no-data-card.component';
import { BackdropLoadingComponent } from '../../../../_components/backdrop-loading/backdrop-loading.component';
import { FormsModule } from '@angular/forms';

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
  templateUrl: './profile-card.component.html'
})
export class ProfileCardComponent implements OnInit {
  page: number = 1;
  pageSize: number = 10;
  count: number = 0;
  isLoading: boolean = false;
  resumes: any[] = [];
  resumeFilter: any = {};

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
        this.toastr.error('Không thể load danh sách hồ sơ', 'Lỗi');
      }
    });
  }

  onChangePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages()) {
      this.page = newPage;
      this.fetchResumes();
    }
  }

  onChangePageSize(newSize: number) {
    this.pageSize = newSize;
    this.page = 1;
    this.fetchResumes();
  }

  onSearch(filter: any) {
    this.resumeFilter = filter;
    this.page = 1;
    this.fetchResumes();
  }

  onReset() {
    this.resumeFilter = {};
    this.page = 1;
    this.pageSize = 10;
    this.fetchResumes();
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
        this.toastr.error('Không thể lưu hồ sơ', 'Lỗi');
      }
    });
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

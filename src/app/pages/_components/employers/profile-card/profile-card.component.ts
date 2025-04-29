import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeService } from '../../../../_services/resume.service';
import { ToastrService } from 'ngx-toastr';
import { errorModal } from '../../../../_utils/sweetalert2-modal';
import { ProfileSearchComponent } from '../profile-search/profile-search.component';
import { JobSeekerProfileComponent } from '../../../../_components/job-seeker-profile/job-seeker-profile.component';
import { NoDataCardComponent } from '../../../../_components/no-data-card/no-data-card.component';
import { BackdropLoadingComponent } from '../../../../_components/backdrop-loading/backdrop-loading.component';

@Component({
  selector: 'app-profile-card',
  imports: [
    CommonModule,
    ProfileSearchComponent,
    JobSeekerProfileComponent,
    NoDataCardComponent
  ],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.css'
})
export class ProfileCardComponent {
  page: number = 1;
  pageSize: number = 10;
  count: number = 0;
  isLoading: boolean = false;
  resumes: any[] = [];

  resumeFilter: any = {}; // giả định nếu bạn chưa có ResumeFilterService

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
    };

    this.resumeService.getResumes(params).subscribe({
      next: (res) => {
        this.count = res.data?.count || 0;
        this.resumes = res.data?.results || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        errorModal('Lỗi', 'Không thể load danh sách hồ sơ');
      }
    });
  }

  onChangePage(newPage: number) {
    this.page = newPage;
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
    this.fetchResumes();
  }

  onSave(slug: string) {
    this.resumeService.saveResume(slug).subscribe({
      next: (res) => {
        const isSaved = res.data?.isSaved;
        this.resumes = this.resumes.map((r) =>
          r.slug === slug ? { ...r, isSaved: isSaved } : r
        );
        this.toastr.success(isSaved ? 'Lưu thành công' : 'Hủy lưu thành công');
      },
      error: () => {
        errorModal('Lỗi', 'Không thể lưu hồ sơ');
      }
    });
  }

  totalPages(): number {
    return Math.ceil(this.count / this.pageSize) || 1;
  }
}

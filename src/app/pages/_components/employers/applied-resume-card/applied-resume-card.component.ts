import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobPostActivityService } from '../../../../_services/job-post-activity.service';
import { JobService } from '../../../../_services/job.service';
import { ToastrService } from 'ngx-toastr';
import { errorModal, confirmModal } from '../../../../_utils/sweetalert2-modal';
import { BackdropLoadingComponent } from '../../../../_components/backdrop-loading/backdrop-loading.component';
import { AppliedResumeTableComponent } from '../applied-resume-table/applied-resume-table.component';
import { exportToXLSX } from '../../../../_utils/xlsx-utils';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-applied-resume-card',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BackdropLoadingComponent,
    AppliedResumeTableComponent
  ],
  templateUrl: './applied-resume-card.component.html',
  styleUrl: './applied-resume-card.component.css'
})
export class AppliedResumeCardComponent {
  resumes: any[] = [];
  jobs: any[] = [];
  page: number = 1;
  pageSize: number = 10;
  total: number = 0;
  isLoading: boolean = false;
  isFullScreenLoading: boolean = false;
  openFilter: boolean = false;
  filterForm: FormGroup;

  constructor(
    private jobPostActivityService: JobPostActivityService,
    private jobService: JobService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      jobPostId: [null],
      applicationStatus: [null],
    });
  }

  ngOnInit(): void {
    this.fetchResumes();
    this.fetchJobs();
  }

  fetchResumes() {
    this.isLoading = true;
    const params = {
      ...this.filterForm.value,
      page: this.page,
      limit: this.pageSize,
      order: { updatedAt: 'desc' },
    };

    this.jobPostActivityService.getAppliedResume(params).subscribe({
      next: (res) => {
        this.resumes = res.data?.results || [];
        this.total = res.data?.count || 0;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        errorModal('Lỗi', 'Không thể tải danh sách ứng viên');
      }
    });
  }

  fetchJobs() {
    this.jobService.getEmployerJobPost({}).subscribe({
      next: (res) => {
        this.jobs = res.data || [];
      },
      error: () => {
        errorModal('Lỗi', 'Không thể tải danh sách tin tuyển dụng');
      }
    });
  }

  handleDelete(id: number) {
    confirmModal(() => {
      this.jobPostActivityService.deleteJobPostActivity(id).subscribe({
        next: () => {
          this.toastr.success('Xóa hồ sơ thành công');
          this.fetchResumes();
        },
        error: () => {
          errorModal('Lỗi', 'Xóa hồ sơ thất bại');
        }
      });
    }, 'Bạn có chắc chắn muốn xóa hồ sơ này?', '', 'warning');
  }

  handleChangeStatus(id: number, status: string) {
    this.jobPostActivityService.changeApplicationStatus(id, { applicationStatus: status }).subscribe({
      next: () => {
        this.toastr.success('Cập nhật trạng thái ứng tuyển thành công');
        this.fetchResumes();
      },
      error: () => {
        errorModal('Lỗi', 'Cập nhật trạng thái thất bại');
      }
    });
  }

  handleExport() {
    this.isFullScreenLoading = true;
    this.jobPostActivityService.exportAppliedResume(this.filterForm.value).subscribe({
      next: (res) => {
        exportToXLSX(res.data, 'danh-sach-ung-tuyen');
        this.isFullScreenLoading = false;
      },
      error: () => {
        this.isFullScreenLoading = false;
        errorModal('Lỗi', 'Xuất file thất bại');
      }
    });
  }

  onFilter() {
    this.page = 1;
    this.fetchResumes();
    this.openFilter = false;
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.fetchResumes();
  }
}

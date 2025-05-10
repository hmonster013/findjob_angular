import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { JobPostActivityService } from '../../../../_services/job-post-activity.service';
import { JobService } from '../../../../_services/job.service';
import { CommonService } from '../../../../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { errorModal, confirmModal } from '../../../../_utils/sweetalert2-modal';
import { BackdropLoadingComponent } from '../../../../_components/backdrop-loading/backdrop-loading.component';
import { AppliedResumeTableComponent } from '../applied-resume-table/applied-resume-table.component';
import { exportToXLSX } from '../../../../_utils/xlsx-utils';

@Component({
  selector: 'app-applied-resume-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BackdropLoadingComponent,
    AppliedResumeTableComponent,
  ],
  templateUrl: './applied-resume-card.component.html',
  styleUrls: ['./applied-resume-card.component.css'],
})
export class AppliedResumeCardComponent implements OnInit, OnDestroy {
  resumes: any[] = [];
  jobs: any[] = [];
  page: number = 0; // 0-based
  pageSize: number = 10;
  total: number = 0;
  isLoading: boolean = false;
  isFullScreenLoading: boolean = false;
  openFilter: boolean = false;
  filterForm: FormGroup;
  applicationStatusOptions: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private jobPostActivityService: JobPostActivityService,
    private jobService: JobService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      jobPostId: [null], // Khởi tạo null thay vì ''
      applicationStatus: [null], // Khởi tạo null thay vì ''
    });
  }

  ngOnInit(): void {
    this.fetchStatusOptions();
    this.fetchResumes();
    this.fetchJobs();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchStatusOptions() {
    this.commonService.getConfigs().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.applicationStatusOptions = Array.isArray(res.data?.applicationStatusOptions)
          ? res.data.applicationStatusOptions
          : [
              { id: '1', name: 'Chờ xác nhận' },
              { id: '2', name: 'Đã liên hệ' },
              { id: '3', name: 'Đã test' },
              { id: '4', name: 'Đã phỏng vấn' },
              { id: '5', name: 'Trúng tuyển' },
              { id: '6', name: 'Không trúng tuyển' },
            ];
      },
      error: () => {
        this.toastr.error('Không thể tải danh sách trạng thái!');
      },
    });
  }

  fetchResumes() {
    this.isLoading = true;
    const params = {
      ...this.filterForm.value,
      page: this.page + 1, // API mong đợi 1-based
      limit: this.pageSize,
      order: { updatedAt: 'desc' },
    };

    // Loại bỏ jobPostId và applicationStatus nếu null
    if (!params.jobPostId) {
      delete params.jobPostId;
    }
    if (!params.applicationStatus) {
      delete params.applicationStatus;
    }

    this.jobPostActivityService.getAppliedResume(params).subscribe({
      next: (res) => {
        this.resumes = Array.isArray(res.data?.results) ? res.data.results : [];
        this.total = res.data?.count || 0;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        errorModal('Lỗi', 'Không thể tải danh sách ứng viên');
      },
    });
  }

  fetchJobs() {
    this.jobService.getEmployerJobPost({}).subscribe({
      next: (res) => {
        this.jobs = Array.isArray(res.data) ? res.data : [];
      },
      error: () => {
        errorModal('Lỗi', 'Không thể tải danh sách tin tuyển dụng');
      },
    });
  }

  handleDelete(id: number) {
    confirmModal(
      () => {
        this.jobPostActivityService.deleteJobPostActivity(id).subscribe({
          next: () => {
            this.toastr.success('Xóa hồ sơ thành công');
            this.fetchResumes();
          },
          error: () => {
            errorModal('Lỗi', 'Xóa hồ sơ thất bại');
          },
        });
      },
      'Bạn có chắc chắn muốn xóa hồ sơ này?',
      '',
      'warning'
    );
  }

  handleChangeStatus(id: number, status: string) {
    this.jobPostActivityService.changeApplicationStatus(id, { applicationStatus: status }).subscribe({
      next: () => {
        this.toastr.success('Cập nhật trạng thái ứng tuyển thành công');
        this.fetchResumes();
      },
      error: () => {
        errorModal('Lỗi', 'Cập nhật trạng thái thất bại');
      },
    });
  }

  handleSendEmail(formData: any) {
    this.isFullScreenLoading = true;
    // Giả định API gửi email
    this.jobPostActivityService.sendEmail(formData.id, formData).subscribe({
      next: () => {
        this.toastr.success('Gửi email thành công!');
        this.fetchResumes();
        this.isFullScreenLoading = false;
      },
      error: () => {
        this.isFullScreenLoading = false;
        errorModal('Lỗi', 'Gửi email thất bại');
      },
    });
  }

  handleExport() {
    if (this.resumes.length === 0) {
      this.toastr.warning('Không có dữ liệu để xuất!');
      return;
    }
    this.isFullScreenLoading = true;
    const params = { ...this.filterForm.value };
    if (!params.jobPostId) {
      delete params.jobPostId;
    }
    if (!params.applicationStatus) {
      delete params.applicationStatus;
    }
    this.jobPostActivityService.exportAppliedResume(params).subscribe({
      next: (res) => {
        exportToXLSX(res.data, 'danh-sach-ung-tuyen');
        this.isFullScreenLoading = false;
      },
      error: () => {
        this.isFullScreenLoading = false;
        errorModal('Lỗi', 'Xuất file thất bại');
      },
    });
  }

  onFilter() {
    this.page = 0;
    this.fetchResumes();
    this.openFilter = false;
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.fetchResumes();
  }

  onRowsPerPageChange(newRowsPerPage: number) {
    this.pageSize = newRowsPerPage;
    this.page = 0;
    this.fetchResumes();
  }
}

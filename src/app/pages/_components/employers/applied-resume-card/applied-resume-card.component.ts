import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { JobPostActivityService } from '../../../../_services/job-post-activity.service';
import { JobService } from '../../../../_services/job.service';
import { CommonService } from '../../../../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { errorModal, confirmModal } from '../../../../_utils/sweetalert2-modal';
import { AppliedResumeTableComponent } from '../applied-resume-table/applied-resume-table.component';
import { exportToXLSX } from '../../../../_utils/xlsx-utils';

@Component({
  selector: 'app-applied-resume-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppliedResumeTableComponent,
  ],
  templateUrl: './applied-resume-card.component.html',
  styleUrls: ['./applied-resume-card.component.css'],
})
export class AppliedResumeCardComponent implements OnInit, OnDestroy {
  resumes: any[] = [];
  jobs: any[] = [];
  page: number = 0;
  pageSize: number = 5;
  total: number = 0;
  isLoading: boolean = false;
  isFullScreenLoading: boolean = false;
  showAdvanceFilter: boolean = false;
  filterForm: FormGroup;
  applicationStatusOptions: any[] = [];
  cityOptions: any[] = [];
  careerOptions: any[] = [];
  experienceOptions: any[] = [];
  positionOptions: any[] = [];
  academicLevelOptions: any[] = [];
  typeOfWorkplaceOptions: any[] = [];
  jobTypeOptions: any[] = [];
  genderOptions: any[] = [];
  maritalStatusOptions: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private jobPostActivityService: JobPostActivityService,
    private jobService: JobService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.filterForm = this.fb.group({
      jobPostId: [null],
      status: [null],
      cityId: [null],
      careerId: [null],
      experienceId: [null],
      positionId: [null],
      academicLevelId: [null],
      typeOfWorkplaceId: [null],
      jobTypeId: [null],
      genderId: [null],
      maritalStatusId: [null],
    });
  }

  ngOnInit(): void {
    forkJoin({
      configs: this.commonService.getConfigs(),
      jobs: this.jobService.getEmployerJobPost({}),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ configs, jobs }) => {
          // Xử lý configs
          this.applicationStatusOptions = configs.data?.applicationStatusOptions || [];
          this.cityOptions = configs.data?.cityOptions || [];
          this.careerOptions = configs.data?.careerOptions || [];
          this.experienceOptions = configs.data?.experienceOptions || [];
          this.positionOptions = configs.data?.positionOptions || [];
          this.academicLevelOptions = configs.data?.academicLevelOptions || [];
          this.typeOfWorkplaceOptions = configs.data?.typeOfWorkplaceOptions || [];
          this.jobTypeOptions = configs.data?.jobTypeOptions || [];
          this.genderOptions = configs.data?.genderOptions || [];
          this.maritalStatusOptions = configs.data?.maritalStatusOptions || [];

          // Xử lý jobs
          this.jobs = Array.isArray(jobs.data?.results) ? jobs.data.results : [];

          // Xử lý query params
          let lastParams: { [key: string]: any } = {};
          this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
            // So sánh params mới với params cũ
            const paramsChanged = Object.keys(params).some(
              key => params[key] !== lastParams[key]
            );
            if (!paramsChanged && Object.keys(lastParams).length > 0) {
              return; // Không cập nhật nếu params không thay đổi
            }
            lastParams = { ...params };

            const jobPostId = params['jobPostId'] ? +params['jobPostId'] : null;
            const validJobPostId = jobPostId && this.jobs.some(job => job.id === jobPostId) ? jobPostId : null;

            this.filterForm.patchValue({
              jobPostId: validJobPostId,
              status: params['status'] || null,
              cityId: params['cityId'] || null,
              careerId: params['careerId'] || null,
              experienceId: params['experienceId'] || null,
              positionId: params['positionId'] || null,
              academicLevelId: params['academicLevelId'] || null,
              typeOfWorkplaceId: params['typeOfWorkplaceId'] || null,
              jobTypeId: params['jobTypeId'] || null,
              genderId: params['genderId'] || null,
              maritalStatusId: params['maritalStatusId'] || null,
            });

            if (Object.values(params).some(val => val)) {
              this.showAdvanceFilter = true;
            }
            this.fetchResumes();
          });
        },
        error: () => {
          this.toastr.error('Không thể tải dữ liệu ban đầu!');
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchResumes() {
    this.isLoading = true;
    const params: { [key: string]: any } = {
      jobPostId: this.filterForm.value.jobPostId,
      status: this.filterForm.value.status,
      cityId: this.filterForm.value.cityId,
      careerId: this.filterForm.value.careerId,
      experienceId: this.filterForm.value.experienceId,
      positionId: this.filterForm.value.positionId,
      academicLevelId: this.filterForm.value.academicLevelId,
      typeOfWorkplaceId: this.filterForm.value.typeOfWorkplaceId,
      jobTypeId: this.filterForm.value.jobTypeId,
      genderId: this.filterForm.value.genderId,
      maritalStatusId: this.filterForm.value.maritalStatusId,
      page: this.page + 1,
      pageSize: this.pageSize,
    };

    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '') {
        delete params[key];
      }
    });

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

  handleChangeStatus(id: number, status: number) {
    this.jobPostActivityService.changeApplicationStatus(id, { status }).subscribe({
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
    // Định nghĩa map trạng thái ứng tuyển
    const statusMap: Record<number, string> = {
      1: 'Chờ duyệt',
      2: 'Đã duyệt',
      3: 'Đã từ chối',
      4: 'Đã rút',
      5: 'Đã phỏng vấn',
      6: 'Đã nhận việc',
      7: 'Đã từ chối nhận việc',
    };
    // Chuẩn bị dữ liệu xuất Excel từ this.resumes
    const exportData = (this.resumes || []).map((item: any) => ({
      'Tên ứng viên': item.fullName || '',
      'Email': item.email || '',
      'Vị trí ứng tuyển': item.title || '',
      'Tin tuyển dụng': item.jobName || '',
      'Ngày ứng tuyển': item.createAt ? new Date(item.createAt).toLocaleDateString('vi-VN') : '',
      'Trạng thái': statusMap[item.status] || 'Không xác định',
      'Đã gửi email': item.isSentEmail ? 'Có' : 'Không',
    }));
    exportToXLSX(exportData, 'danh-sach-ung-tuyen');
    this.isFullScreenLoading = false;
  }

  onSubmit() {
    this.page = 0;
    const data = this.filterForm.value;

    // Kiểm tra jobPostId
    if (data.jobPostId && !this.jobs.some(job => job.id === data.jobPostId)) {
      data.jobPostId = null;
      this.filterForm.patchValue({ jobPostId: null });
    }

    const queryParams = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== null && v !== '')
    );
    this.router.navigate([], { queryParams, relativeTo: this.route });
  }

  onReset() {
    this.filterForm.reset({
      jobPostId: null,
      status: null,
      cityId: null,
      careerId: null,
      experienceId: null,
      positionId: null,
      academicLevelId: null,
      typeOfWorkplaceId: null,
      jobTypeId: null,
      genderId: null,
      maritalStatusId: null,
    });
    this.showAdvanceFilter = false;
    this.router.navigate([], { queryParams: {}, relativeTo: this.route });
    this.fetchResumes();
  }

  toggleAdvanceFilter() {
    this.showAdvanceFilter = !this.showAdvanceFilter;
  }

  isFormNotEmpty(): boolean {
    const values = this.filterForm.value;
    return Object.values(values).some(value => value !== null && value !== '');
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

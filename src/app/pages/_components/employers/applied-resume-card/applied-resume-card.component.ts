import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
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
      kw: [''],
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
    this.fetchConfigs();
    this.fetchJobs();
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.filterForm.patchValue({
        kw: params['kw'] || '',
        jobPostId: params['jobPostId'] || null,
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
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchConfigs() {
    this.commonService.getConfigs().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.applicationStatusOptions = res.data?.applicationStatusOptions || [];
        this.cityOptions = res.data?.cityOptions || [];
        this.careerOptions = res.data?.careerOptions || [];
        this.experienceOptions = res.data?.experienceOptions || [];
        this.positionOptions = res.data?.positionOptions || [];
        this.academicLevelOptions = res.data?.academicLevelOptions || [];
        this.typeOfWorkplaceOptions = res.data?.typeOfWorkplaceOptions || [];
        this.jobTypeOptions = res.data?.jobTypeOptions || [];
        this.genderOptions = res.data?.genderOptions || [];
        this.maritalStatusOptions = res.data?.maritalStatusOptions || [];
      },
      error: () => {
        this.toastr.error('Không thể tải cấu hình!');
      },
    });
  }

  fetchResumes() {
    this.isLoading = true;
    const params: { [key: string]: any } = {
      kw: this.filterForm.value.kw,
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

    // Loại bỏ các trường null hoặc rỗng
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

  fetchJobs() {
    this.jobService.getEmployerJobPost({}).subscribe({
      next: (res) => {
        this.jobs = Array.isArray(res.data?.results) ? res.data.results : [];
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
    const params: { [key: string]: any } = {
      kw: this.filterForm.value.kw,
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
    };
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '') {
        delete params[key];
      }
    });
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

  handleSaveKeywordLocalStorage(kw: string) {
    try {
      if (kw) {
        const keywordListStr = localStorage.getItem('resume_search_history');
        let keywordList = keywordListStr ? JSON.parse(keywordListStr) : [];
        if (!keywordList.includes(kw)) {
          if (keywordList.length >= 5) {
            keywordList = [kw, ...keywordList.slice(0, 4)];
          } else {
            keywordList = [kw, ...keywordList];
          }
          localStorage.setItem('resume_search_history', JSON.stringify(keywordList));
        }
      }
    } catch (error) {
      console.error('Lỗi khi lưu từ khóa:', error);
    }
  }

  onSubmit() {
    this.page = 0;
    const data = this.filterForm.value;
    this.handleSaveKeywordLocalStorage(data.kw);
    const queryParams = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== null && v !== '')
    );
    this.router.navigate([], { queryParams, relativeTo: this.route });
    this.fetchResumes();
  }

  onReset() {
    this.filterForm.reset({
      kw: '',
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

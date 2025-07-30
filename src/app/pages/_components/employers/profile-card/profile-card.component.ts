import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ResumeService } from '../../../../_services/resume.service';
import { CommonService } from '../../../../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { ProfileSearchComponent } from '../profile-search/profile-search.component';
import { NoDataCardComponent } from '../../../../_components/no-data-card/no-data-card.component';
import Swal from 'sweetalert2';
import { JobSeekerProfileComponent } from '../../../../_components/job-seeker-profile/job-seeker-profile.component';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProfileSearchComponent,
    JobSeekerProfileComponent,
    NoDataCardComponent,
  ],
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css'],
})
export class ProfileCardComponent implements OnInit, OnDestroy {
  page: number = 1;
  pageSize: number = 10;
  count: number = 0;
  isLoading: boolean = false;
  resumes: any[] = [];
  resumeFilter: any = {};
  allConfigs: any;
  private destroy$ = new Subject<void>();

  constructor(
    private resumeService: ResumeService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getConfigs();
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.resumeFilter = {
        kw: params['kw'] || '',
        cityId: params['cityId'] ? +params['cityId'] : null,
        careerId: params['careerId'] ? +params['careerId'] : null,
        experienceId: params['experienceId'] ? +params['experienceId'] : null,
        positionId: params['positionId'] ? +params['positionId'] : null,
        academicLevelId: params['academicLevelId'] ? +params['academicLevelId'] : null,
        typeOfWorkplaceId: params['typeOfWorkplaceId'] ? +params['typeOfWorkplaceId'] : null,
        jobTypeId: params['jobTypeId'] ? +params['jobTypeId'] : null,
        genderId: params['genderId'] || null,
        maritalStatusId: params['maritalStatusId'] || null,
      };
      this.page = params['page'] ? +params['page'] : 1;
      this.pageSize = params['pageSize'] ? +params['pageSize'] : 10;
      this.fetchResumes();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getConfigs() {
    this.commonService.getConfigs().subscribe({
      next: (res) => {
        this.allConfigs = res.data;
      },
      error: (err) => {
        console.error('Lỗi khi lấy configs:', err);
      }
    });
  }

  fetchResumes() {
    this.isLoading = true;
    type FilterParams = {
      kw?: string;
      cityId?: number | null;
      careerId?: number | null;
      experienceId?: number | null;
      positionId?: number | null;
      academicLevelId?: number | null;
      typeOfWorkplaceId?: number | null;
      jobTypeId?: number | null;
      genderId?: string | null;
      maritalStatusId?: string | null;
      page: number;
      pageSize: number;
    };

    const params: FilterParams = {
      ...this.resumeFilter,
      page: this.page,
      pageSize: this.pageSize,
    };

    Object.keys(params).forEach(key => {
      if (params[key as keyof FilterParams] === '' || params[key as keyof FilterParams] === null) {
        delete params[key as keyof FilterParams];
      }
    });

    this.resumeService.getResumes(params).subscribe({
      next: (res) => {
        this.count = res.data?.count || 0;
        this.resumes = (res.data?.results || []).map((resume: any) => ({
          ...resume,
          experienceName: this.getExperienceName(resume.experience),
          cityName: this.getCityName(resume.city),
        }));
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        Swal.fire({
          title: 'Lỗi',
          text: 'Không thể tải danh sách hồ sơ',
          icon: 'error',
          confirmButtonText: 'Đóng',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700',
          },
        });
      },
    });
  }

  getExperienceName(experienceId: number | null | undefined): string {
    if (!experienceId || !this.allConfigs?.experienceDict) {
      return 'Chưa cập nhật';
    }
    return this.allConfigs.experienceDict[experienceId] || 'Chưa cập nhật';
  }

  getCityName(cityId: number | null | undefined): string {
    if (!cityId || !this.allConfigs?.cityDict) {
      return 'Chưa cập nhật';
    }
    return this.allConfigs.cityDict[cityId] || 'Chưa cập nhật';
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
        cancelButton: 'bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 mr-2',
      },
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
            confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700',
          },
        });
      },
    });
  }

  onSearch(filter: any) {
    this.resumeFilter = { ...filter };
    this.page = 1;
    const queryParams = {
      ...this.resumeFilter,
      page: this.page,
      pageSize: this.pageSize,
    };
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === null || queryParams[key] === '') {
        delete queryParams[key];
      }
    });
    this.router.navigate([], { queryParams, relativeTo: this.route });
  }

  onReset() {
    this.resumeFilter = {};
    this.page = 1;
    this.pageSize = 10;
    this.router.navigate([], { queryParams: {}, relativeTo: this.route });
  }

  onChangePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      const queryParams = {
        ...this.resumeFilter,
        page: this.page,
        pageSize: this.pageSize,
      };
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === null || queryParams[key] === '') {
          delete queryParams[key];
        }
      });
      this.router.navigate([], { queryParams, relativeTo: this.route });
    }
  }

  onChangePageSize(event: Event) {
    const target = event.target as HTMLSelectElement;
    const size = +target.value;
    this.pageSize = size;
    this.page = 1;
    const queryParams = {
      ...this.resumeFilter,
      page: this.page,
      pageSize: this.pageSize,
    };
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === null || queryParams[key] === '') {
        delete queryParams[key];
      }
    });
    this.router.navigate([], { queryParams, relativeTo: this.route });
  }

  get totalPages(): number {
    return Math.ceil(this.count / this.pageSize) || 1;
  }

  getVisiblePages(): number[] {
    const maxVisiblePages = 5;
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, this.page - half);
    let end = Math.min(this.totalPages, start + maxVisiblePages - 1);
    start = Math.max(1, end - maxVisiblePages + 1);
    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}

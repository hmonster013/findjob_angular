import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from '../../../../_services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-search.component.html',
  styleUrls: ['./profile-search.component.css'],
})
export class ProfileSearchComponent implements OnInit, OnDestroy {
  @Output() search = new EventEmitter<any>();
  @Output() reset = new EventEmitter<void>();

  searchForm: FormGroup;
  configs: any = {};
  isLoading: boolean = false;
  showAdvanced: boolean = false;
  private destroy$ = new Subject<void>();

  private advancedFilterFields = [
    'careerId',
    'experienceId',
    'positionId',
    'academicLevelId',
    'typeOfWorkplaceId',
    'jobTypeId',
    'genderId',
    'maritalStatusId'
  ];

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.searchForm = this.fb.group({
      kw: [''],
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
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.searchForm.patchValue({
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
      });

      this.showAdvanced = Object.keys(params).some(key => this.advancedFilterFields.includes(key) && params[key] !== '' && params[key] !== null);

      // Chỉ gọi onSubmit nếu có tham số lọc
      const hasFilterParams = Object.keys(params).some(key =>
        !['page', 'pageSize'].includes(key) && params[key] !== '' && params[key] !== null
      );
      if (hasFilterParams) {
        this.onSubmit();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchConfigs() {
    this.commonService.getConfigs().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.configs = res.data || {};
      },
      error: () => {
        Swal.fire({
          title: 'Lỗi',
          text: 'Không thể tải cấu hình bộ lọc!',
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

  handleSaveKeywordLocalStorage(kw: string) {
    try {
      if (kw) {
        const keywordListStr = localStorage.getItem('profile_search_history');
        let keywordList = keywordListStr ? JSON.parse(keywordListStr) : [];
        if (!keywordList.includes(kw)) {
          if (keywordList.length >= 5) {
            keywordList = [kw, ...keywordList.slice(0, 4)];
          } else {
            keywordList = [kw, ...keywordList];
          }
          localStorage.setItem('profile_search_history', JSON.stringify(keywordList));
        }
      }
    } catch (error) {
      console.error('Lỗi khi lưu từ khóa:', error);
    }
  }

  onSubmit() {
    if (this.searchForm.valid) {
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
      };

      const formValue: FilterParams = { ...this.searchForm.value };
      this.handleSaveKeywordLocalStorage(formValue.kw || '');
      Object.keys(formValue).forEach(key => {
        if (formValue[key as keyof FilterParams] === '' || formValue[key as keyof FilterParams] === null) {
          delete formValue[key as keyof FilterParams];
        }
      });
      this.search.emit(formValue);
      this.isLoading = false;
    } else {
      Swal.fire({
        title: 'Cảnh báo',
        text: 'Vui lòng nhập dữ liệu hợp lệ!',
        icon: 'warning',
        confirmButtonText: 'Đóng',
        buttonsStyling: false,
        customClass: {
          confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700',
        },
      });
    }
  }

  onReset() {
    this.searchForm.reset({
      kw: '',
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
    this.showAdvanced = false;
    this.reset.emit();
  }

  toggleAdvanced() {
    this.showAdvanced = !this.showAdvanced;
  }

  isFormNotEmpty(): boolean {
    return Object.values(this.searchForm.value).some(value => value !== null && value !== '');
  }
}

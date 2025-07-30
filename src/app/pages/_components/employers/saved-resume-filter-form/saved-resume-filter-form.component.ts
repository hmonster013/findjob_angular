import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from '../../../../_services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-saved-resume-filter-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './saved-resume-filter-form.component.html',
  styleUrls: ['./saved-resume-filter-form.component.css'],
})
export class SavedResumeFilterFormComponent implements OnInit, OnDestroy {
  @Output() handleFilter = new EventEmitter<any>();

  form: FormGroup;
  configs: any = {};
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      kw: ['', [Validators.maxLength(100)]],
      salaryMax: [null, [Validators.min(0)]],
      experienceId: [null],
      cityId: [null],
    });
  }

  ngOnInit(): void {
    this.fetchConfigs();
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.form.patchValue({
        kw: params['kw'] || '',
        salaryMax: params['salaryMax'] ? +params['salaryMax'] : null,
        experienceId: params['experienceId'] ? +params['experienceId'] : null,
        cityId: params['cityId'] ? +params['cityId'] : null,
      });
      this.onSubmit();
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
        const keywordListStr = localStorage.getItem('saved_resume_filter_history');
        let keywordList = keywordListStr ? JSON.parse(keywordListStr) : [];
        if (!keywordList.includes(kw)) {
          if (keywordList.length >= 5) {
            keywordList = [kw, ...keywordList.slice(0, 4)];
          } else {
            keywordList = [kw, ...keywordList];
          }
          localStorage.setItem('saved_resume_filter_history', JSON.stringify(keywordList));
        }
      }
    } catch (error) {
      console.error('Lỗi khi lưu từ khóa:', error);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      type FilterParams = {
        kw?: string;
        salaryMax?: number | null;
        experienceId?: number | null;
        cityId?: number | null;
      };

      const formValue: FilterParams = { ...this.form.value };
      this.handleSaveKeywordLocalStorage(formValue.kw || '');
      // Remove empty or null values
      Object.keys(formValue).forEach(key => {
        if (formValue[key as keyof FilterParams] === '' || formValue[key as keyof FilterParams] === null) {
          delete formValue[key as keyof FilterParams];
        }
      });
      const queryParams = Object.fromEntries(
        Object.entries(formValue).filter(([_, v]) => v !== null && v !== '')
      );
      this.router.navigate([], { queryParams, relativeTo: this.route });
      this.handleFilter.emit(formValue);
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
    this.form.reset({
      kw: '',
      salaryMax: null,
      experienceId: null,
      cityId: null,
    });
    this.router.navigate([], { queryParams: {}, relativeTo: this.route });
    this.handleFilter.emit({});
  }

  isFormNotEmpty(): boolean {
    const values = this.form.value;
    return Object.values(values).some(value => value !== null && value !== '');
  }
}

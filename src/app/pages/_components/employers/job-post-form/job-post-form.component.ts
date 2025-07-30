import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { QuillModule } from 'ngx-quill';
import { CommonService } from '../../../../_services/common.service';
import { confirmModal } from '../../../../_utils/sweetalert2-modal';

@Component({
  selector: 'app-job-post-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QuillModule],
  templateUrl: './job-post-form.component.html',
  styleUrls: ['./job-post-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobPostFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() editData: any = null;
  @Input() serverErrors: any = {};
  @Output() handleAddOrUpdate = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  cityOptions: any[] = [];
  districtOptions: any[] = [];
  isLoadingDistricts: boolean = false;
  allConfig: any = {
    careerOptions: [],
    positionOptions: [],
    experienceOptions: [],
    typeOfWorkplaceOptions: [],
    jobTypeOptions: [],
    academicLevelOptions: [],
    genderOptions: []
  };
  destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      jobName: ['', [Validators.required, Validators.maxLength(200)]],
      career: ['', Validators.required],
      position: ['', Validators.required],
      experience: ['', Validators.required],
      typeOfWorkplace: ['', Validators.required],
      jobType: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      genderRequired: ['', Validators.required],
      salaryMin: ['', [Validators.required, Validators.min(0)]],
      salaryMax: ['', [Validators.required, Validators.min(0)]],
      academicLevel: ['', Validators.required],
      deadline: ['', [Validators.required, this.minDateValidator()]],
      jobDescription: ['', [Validators.required, this.quillContentValidator()]],
      jobRequirement: ['', [Validators.required, this.quillContentValidator()]],
      benefitsEnjoyed: ['', [Validators.required, this.quillContentValidator()]],
      location: this.fb.group({
        city: ['', Validators.required],
        district: ['', Validators.required],
        address: ['', [Validators.required, Validators.maxLength(255)]],
        lat: ['', [Validators.required, Validators.pattern(/^-?\d*\.?\d+$/)]],
        lng: ['', [Validators.required, Validators.pattern(/^-?\d*\.?\d+$/)]]
      }),
      contactPersonName: ['', [Validators.required, Validators.maxLength(100)]],
      contactPersonPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      contactPersonEmail: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      isUrgent: [false]
    }, { validators: this.salaryComparisonValidator() });

    // Lắng nghe thay đổi của salaryMin và salaryMax
    this.form.get('salaryMin')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.form.get('salaryMax')?.updateValueAndValidity({ emitEvent: false });
      this.form.updateValueAndValidity({ emitEvent: false }); // Cập nhật validator cấp form
      this.cdr.markForCheck();
    });
    this.form.get('salaryMax')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.form.get('salaryMin')?.updateValueAndValidity({ emitEvent: false });
      this.form.updateValueAndValidity({ emitEvent: false }); // Cập nhật validator cấp form
      this.cdr.markForCheck();
    });
  }

  ngOnInit(): void {
    this.fetchConfigs();
    this.fetchCities();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editData'] && this.editData) {
      const location = this.editData.location || {};
      this.form.patchValue({
        ...this.editData,
        location: {
          city: location.city ? String(location.city) : '',
          district: location.district ? String(location.district) : '',
          address: location.address || '',
          lat: location.lat ? String(location.lat) : '',
          lng: location.lng ? String(location.lng) : ''
        }
      }, { emitEvent: false }); // Ngăn phát sự kiện để tránh lặp vô hạn
      if (location.city) {
        this.fetchDistricts(Number(location.city));
      }
      this.cdr.markForCheck();
    }
    if (changes['serverErrors'] && this.serverErrors) {
      this.setServerErrors();
    }
  }

  fetchConfigs() {
    this.commonService.getConfigs().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.allConfig = res.data || this.allConfig;
        console.log('Configs loaded:', this.allConfig);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching configs:', err);
      }
    });
  }

  fetchCities() {
    this.commonService.getCities().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.cityOptions = res.data || [];
        console.log('City options loaded:', this.cityOptions);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching cities:', err);
      }
    });
  }

  fetchDistricts(cityId: number) {
    if (!cityId) {
      this.districtOptions = [];
      this.form.get('location.district')?.setValue('');
      this.cdr.markForCheck();
      return;
    }
    this.isLoadingDistricts = true;
    this.commonService.getDistrictsByCityId(cityId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.districtOptions = res.data || [];
        console.log(`District options for city ${cityId}:`, this.districtOptions);
        this.isLoadingDistricts = false;
        if (this.editData?.location?.district) {
          const districtValue = this.districtOptions.find(d => d.id === Number(this.editData.location.district)) ?
            String(this.editData.location.district) : '';
          this.form.get('location.district')?.setValue(districtValue);
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(`Error fetching districts for city ${cityId}:`, err);
        this.districtOptions = [];
        this.form.get('location.district')?.setValue('');
        this.isLoadingDistricts = false;
        this.cdr.markForCheck();
      }
    });
  }

  onCityChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.form.get('location.district')?.setValue('');
    this.fetchDistricts(Number(value));
  }

  setServerErrors() {
    if (!this.serverErrors) return;
    Object.keys(this.serverErrors).forEach(field => {
      const control = this.form.get(field) || this.form.get(field.split('.').join('.'));
      if (control) {
        control.setErrors({
          serverError: Array.isArray(this.serverErrors[field])
            ? this.serverErrors[field].join(' ')
            : this.serverErrors[field]
        });
      }
    });
    this.cdr.markForCheck();
  }

  salaryComparisonValidator() {
    return (form: FormGroup): ValidationErrors | null => {
      const salaryMin = form.get('salaryMin')?.value;
      const salaryMax = form.get('salaryMax')?.value;
      const errors: ValidationErrors = {};

      if (salaryMin && salaryMax && Number(salaryMin) >= Number(salaryMax)) {
        form.get('salaryMin')?.setErrors({ minGreaterThanMax: 'Lương tối thiểu phải nhỏ hơn lương tối đa' });
        form.get('salaryMax')?.setErrors({ maxLessThanMin: 'Lương tối đa phải lớn hơn lương tối thiểu' });
        errors['salaryComparison'] = 'Lương tối thiểu phải nhỏ hơn lương tối đa';
      } else {
        // Xóa lỗi nếu hợp lệ, nhưng giữ các lỗi khác (như required hoặc min)
        const minErrors = form.get('salaryMin')?.errors;
        const maxErrors = form.get('salaryMax')?.errors;
        if (minErrors && minErrors['minGreaterThanMax']) {
          const { minGreaterThanMax, ...otherMinErrors } = minErrors;
          form.get('salaryMin')?.setErrors(Object.keys(otherMinErrors).length > 0 ? otherMinErrors : null);
        }
        if (maxErrors && maxErrors['maxLessThanMin']) {
          const { maxLessThanMin, ...otherMaxErrors } = maxErrors;
          form.get('salaryMax')?.setErrors(Object.keys(otherMaxErrors).length > 0 ? otherMaxErrors : null);
        }
      }
      return Object.keys(errors).length > 0 ? errors : null;
    };
  }

  minDateValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const value = control.value ? new Date(control.value) : null;
      return value && value <= today ? { minDate: 'Hạn nộp hồ sơ phải lớn hơn ngày hôm nay' } : null;
    };
  }

  quillContentValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const text = value?.replace(/<[^>]*>/g, '').trim();
      return !text ? { noContent: 'Trường này phải có nội dung' } : null;
    };
  }

  onSubmit() {
    if (this.form.valid) {
      this.handleAddOrUpdate.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity({ emitEvent: false }); // Đảm bảo validator cấp form chạy
      this.cdr.markForCheck();
    }
  }

  onCancel() {
    if (this.form.dirty) {
      confirmModal(() => {
        this.form.reset();
        this.cancel.emit();
        this.cdr.markForCheck();
      }, 'Bạn có chắc muốn hủy?', 'Các thay đổi sẽ không được lưu.', 'warning');
    } else {
      this.form.reset();
      this.cancel.emit();
      this.cdr.markForCheck();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

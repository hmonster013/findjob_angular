import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { QuillModule } from 'ngx-quill';
import { CommonService } from '../../../../_services/common.service';

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

  form: FormGroup;
  cityOptions: any[] = [];
  districtOptions: any[] = [];
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

  constructor(private fb: FormBuilder, private commonService: CommonService) {
    this.form = this.fb.group({
      jobName: ['', [Validators.required, Validators.maxLength(200)]],
      career: ['', Validators.required],
      position: ['', Validators.required],
      experience: ['', Validators.required],
      typeOfWorkplace: ['', Validators.required],
      jobType: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      genderRequired: ['', Validators.required],
      salaryMin: ['', [Validators.required, Validators.min(0), this.salaryComparisonValidator('min')]],
      salaryMax: ['', [Validators.required, Validators.min(0), this.salaryComparisonValidator('max')]],
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
    });
  }

  ngOnInit(): void {
    this.fetchConfigs();
    this.fetchCities();
    console.log('Form initialized:', this.form.getRawValue());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editData'] && this.editData) {
      // Ensure location is properly patched
      const location = this.editData.location || {};
      this.form.patchValue({
        ...this.editData,
        location: {
          city: location.city || '',
          district: location.district || '',
          address: location.address || '',
          lat: location.lat || '',
          lng: location.lng || ''
        }
      });
      if (this.editData.location?.city) {
        this.fetchDistricts(this.editData.location.city);
      }
    }
    if (changes['serverErrors'] && this.serverErrors) {
      this.setServerErrors();
    }
  }

  fetchConfigs() {
    this.commonService.getConfigs().pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.allConfig = res.data || this.allConfig;
    });
  }

  fetchCities() {
    this.commonService.getCities().pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.cityOptions = res.data || [];
    });
  }

  fetchDistricts(cityId: any) {
    if (!cityId) {
      this.districtOptions = [];
      this.form.get('location.district')?.reset();
      return;
    }
    this.commonService.getDistrictsByCityId(cityId).pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.districtOptions = res.data || [];
      this.form.get('location.district')?.reset();
    });
  }

  onCityChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.fetchDistricts(value);
  }

  setServerErrors() {
    Object.keys(this.serverErrors).forEach(field => {
      // Handle flat fields (e.g., jobName)
      const control = this.form.get(field);
      if (control) {
        control.setErrors({
          serverError: Array.isArray(this.serverErrors[field])
            ? this.serverErrors[field].join(' ')
            : this.serverErrors[field]
        });
        return;
      }

      // Handle nested fields (e.g., location.city)
      const path = field.split('.');
      let nestedControl: AbstractControl | null = this.form;
      for (const part of path) {
        nestedControl = nestedControl?.get(part);
        if (!nestedControl) break;
      }
      if (nestedControl) {
        nestedControl.setErrors({
          serverError: Array.isArray(this.serverErrors[field])
            ? this.serverErrors[field].join(' ')
            : this.serverErrors[field]
        });
      }
    });
  }

  salaryComparisonValidator(type: 'min' | 'max') {
    return (control: AbstractControl): ValidationErrors | null => {
      const salaryMin = this.form?.get('salaryMin')?.value;
      const salaryMax = this.form?.get('salaryMax')?.value;
      if (type === 'min' && salaryMin && salaryMax && salaryMin >= salaryMax) {
        return { minGreaterThanMax: 'Lương tối thiểu phải nhỏ hơn lương tối đa' };
      }
      if (type === 'max' && salaryMin && salaryMax && salaryMax <= salaryMin) {
        return { maxLessThanMin: 'Lương tối đa phải lớn hơn lương tối thiểu' };
      }
      return null;
    };
  }

  minDateValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const value = new Date(control.value);
      return value <= today ? { minDate: 'Hạn nộp hồ sơ phải lớn hơn ngày hôm nay' } : null;
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
    }
  }

  onCancel() {
    this.form.reset();
    this.handleAddOrUpdate.emit(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

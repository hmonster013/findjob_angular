import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from '../../../../_services/common.service';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QuillModule],
  templateUrl: './company-form.component.html'
})
export class CompanyFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() editData: any = null;
  @Input() serverErrors: any = {};
  @Output() handleSave = new EventEmitter<any>();

  form: FormGroup;
  cityOptions: any[] = [];
  districtOptions: any[] = [];
  destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private commonService: CommonService) {
    this.form = this.fb.group({
      companyName: ['', [Validators.required, Validators.maxLength(100)]],
      taxCode: ['', [Validators.maxLength(20)]],
      employeeSize: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      fieldOperation: ['', [Validators.required, Validators.maxLength(100)]],
      since: ['', [Validators.pattern('^[0-9]{4}-[0-9]{2}-[0-9]{2}$')]],
      websiteUrl: ['', [Validators.pattern('^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?$')]],
      facebookUrl: ['', [Validators.pattern('^(https?://)?(www\\.)?facebook\\.com/.*$')]],
      youtubeUrl: ['', [Validators.pattern('^(https?://)?(www\\.)?youtube\\.com/.*$')]],
      linkedinUrl: ['', [Validators.pattern('^(https?://)?(www\\.)?linkedin\\.com/.*$')]],
      companyEmail: ['', [Validators.required, Validators.email]],
      companyPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]],
      location: this.fb.group({
        city: ['', Validators.required],
        district: ['', Validators.required],
        address: ['', [Validators.required, Validators.maxLength(200)]],
        latitude: [''],
        longitude: ['']
      }),
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.fetchCities();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editData'] && this.editData) {
      this.form.patchValue(this.editData);
      if (this.editData.location?.city) {
        this.fetchDistricts(String(this.editData.location.city));
      }
    }
    if (changes['serverErrors'] && this.serverErrors) {
      this.setServerErrors();
    }
  }

  fetchCities() {
    this.commonService.getCities().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.cityOptions = res.data || [];
      },
      error: () => {
        console.error('Error fetching cities');
      }
    });
  }

  fetchDistricts(cityId: string) {
    if (!cityId) {
      this.districtOptions = [];
      this.form.get('location.district')?.reset();
      return;
    }
    const numericCityId = Number(cityId);
    if (isNaN(numericCityId)) {
      this.districtOptions = [];
      this.form.get('location.district')?.reset();
      return;
    }
    this.commonService.getDistrictsByCityId(numericCityId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.districtOptions = res.data || [];
      },
      error: () => {
        console.error('Error fetching districts');
      }
    });
  }

  onCityChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target?.value || '';
    this.fetchDistricts(value);
  }

  setServerErrors() {
    Object.entries(this.serverErrors).forEach(([field, error]) => {
      const control = field.includes('.') ? this.form.get(field) : this.form.get(field);
      if (control) {
        control.setErrors({ serverError: error });
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.handleSave.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from '../../../../_services/common.service';

@Component({
  selector: 'app-company-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    QuillModule
  ],
  templateUrl: './company-form.component.html',
  styleUrl: './company-form.component.css'
})
export class CompanyFormComponent {
  @Input() editData: any = null;
  @Input() serverErrors: any = {};
  @Output() handleSave = new EventEmitter<any>();

  form: FormGroup;
  cityOptions: any[] = [];
  districtOptions: any[] = [];
  destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private commonService: CommonService) {
    this.form = this.fb.group({
      companyName: ['', Validators.required],
      taxCode: [''],
      employeeSize: ['', Validators.required],
      fieldOperation: ['', Validators.required],
      since: [''],
      websiteUrl: [''],
      facebookUrl: [''],
      youtubeUrl: [''],
      linkedinUrl: [''],
      companyEmail: ['', [Validators.required, Validators.email]],
      companyPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]],
      location: this.fb.group({
        city: ['', Validators.required],
        district: ['', Validators.required],
        address: ['', Validators.required],
        latitude: [''],
        longitude: ['']
      }),
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchCities();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editData'] && this.editData) {
      this.form.patchValue(this.editData);
    }
    if (changes['serverErrors'] && this.serverErrors) {
      this.setServerErrors();
    }
  }

  fetchCities() {
    this.commonService.getCities().pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.cityOptions = res.data;
    });
  }

  fetchDistricts(cityId: any) {
    if (!cityId) return;
    this.commonService.getDistrictsByCityId(cityId).pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.districtOptions = res.data;
    });
  }

  onCityChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target?.value;
    this.fetchDistricts(value);
  }

  setServerErrors() {
    Object.keys(this.serverErrors).forEach(field => {
      const control = this.form.get(field);
      if (control) {
        control.setErrors({ serverError: this.serverErrors[field] });
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

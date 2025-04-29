import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, debounceTime, switchMap, takeUntil } from 'rxjs';
import { QuillModule } from 'ngx-quill';
import { CommonService } from '../../../../_services/common.service';

@Component({
  selector: 'app-job-post-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    QuillModule
  ],
  templateUrl: './job-post-form.component.html',
  styleUrl: './job-post-form.component.css'
})
export class JobPostFormComponent {
  @Input() editData: any = null;
  @Input() serverErrors: any = {};
  @Output() handleAddOrUpdate = new EventEmitter<any>();

  form: FormGroup;
  cityOptions: any[] = [];
  districtOptions: any[] = [];
  destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private commonService: CommonService) {
    this.form = this.fb.group({
      jobTitle: ['', Validators.required],
      salaryMin: ['', [Validators.required, Validators.min(0)]],
      salaryMax: ['', [Validators.required, Validators.min(0)]],
      deadline: ['', Validators.required],
      jobDescription: ['', Validators.required],
      jobRequirement: ['', Validators.required],
      benefitsEnjoyed: ['', Validators.required],
      location: this.fb.group({
        city: ['', Validators.required],
        district: ['', Validators.required],
        address: ['', Validators.required],
        latitude: [''],
        longitude: ['']
      }),
      careerIds: [[], Validators.required],
      academicRankIds: [[]],
      experienceIds: [[]],
      workingFormIds: [[]],
      genderRequirement: [''],
      jobLevel: [''],
      quantity: ['', [Validators.required, Validators.min(1)]],
      minAge: [''],
      maxAge: [''],
      probationTime: [''],
      probationSalary: [''],
      urgentRecruitment: [false],
      benefitNote: [''],
      contactName: ['', Validators.required],
      contactPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]],
      contactEmail: ['', [Validators.required, Validators.email]],
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
      this.handleAddOrUpdate.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

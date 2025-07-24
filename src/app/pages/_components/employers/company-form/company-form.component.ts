import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { of, Subject, takeUntil, tap, timeout } from 'rxjs';
import { CommonService } from '../../../../_services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QuillModule],
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css']
})
export class CompanyFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() editData: any = null;
  @Input() serverErrors: any = {};
  @Output() handleSave = new EventEmitter<any>();

  form: FormGroup;
  cityOptions: any[] = [];
  districtOptions: any[] = [];
  employeeSizeOptions: any[] = [];
  destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService
  ) {
    this.form = this.fb.group({
      id: [''],
      companyName: ['', [Validators.required, Validators.maxLength(100)]],
      taxCode: ['', [Validators.maxLength(20), Validators.pattern(/^\d{10}(\d{3})?$/)]],
      employeeSize: ['', Validators.required],
      fieldOperation: ['', [Validators.required, Validators.maxLength(100)]],
      since: ['', [Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]],
      websiteUrl: ['', [Validators.pattern('^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?$')]],
      facebookUrl: ['', [Validators.pattern('^(https?://)?(www\\.)?facebook\\.com/.*$')]],
      youtubeUrl: ['', [Validators.pattern('^(https?://)?(www\\.)?youtube\\.com/.*$')]],
      linkedinUrl: ['', [Validators.pattern('^(https?://)?(www\\.)?linkedin\\.com/.*$')]],
      companyEmail: ['', [Validators.required, Validators.email]],
      companyPhone: ['', [Validators.required, Validators.pattern('^0[0-9]{9,10}$')]],
      location: this.fb.group({
        city: ['', Validators.required],
        district: [''],
        address: ['', [Validators.required, Validators.maxLength(200)]],
        lat: ['', [Validators.pattern(/^-?\d*\.?\d+$/)]],
        lng: ['', [Validators.pattern(/^-?\d*\.?\d+$/)]]
      }),
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.fetchCities();
    this.fetchEmployeeSizeOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editData'] && this.editData) {
      const sinceDate = this.editData.since || '';
      // Cập nhật các trường khác trước, nhưng không đặt district ngay
      this.form.patchValue({
        ...this.editData,
        since: sinceDate,
        location: {
          city: this.editData.location?.city?.toString() || '',
          address: this.editData.location?.address || '',
          lat: this.editData.location?.lat?.toString() || '',
          lng: this.editData.location?.lng?.toString() || ''
        }
      });

      // Nếu có city, tải districts và đặt district sau khi hoàn thành
      if (this.editData.location?.city) {
        this.fetchDistricts(this.editData.location.city.toString()).subscribe(() => {
          // Chỉ đặt district sau khi districtOptions đã được cập nhật
          this.form.get('location.district')?.setValue(this.editData.location?.district?.toString() || '');
        });
      }
    }
    if (changes['serverErrors'] && this.serverErrors) {
      this.setServerErrors();
    }
  }

  fetchCities() {
    this.commonService.getCities().pipe(
      timeout(5000),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        this.cityOptions = res.data || [];
        if (this.editData?.location?.city) {
          this.form.get('location.city')?.setValue(this.editData.location.city.toString());
          this.fetchDistricts(this.editData.location.city.toString());
        }
      },
      error: () => {
        console.error('Error fetching cities');
        Swal.fire({
          title: 'Lỗi',
          text: 'Không thể tải danh sách tỉnh/thành phố',
          icon: 'error',
          confirmButtonText: 'Đóng',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700'
          }
        });
      }
    });
  }

  fetchEmployeeSizeOptions() {
    this.commonService.getConfigs().pipe(
      timeout(5000),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        this.employeeSizeOptions = res.data?.employeeSizeOptions || [];
        if (this.editData?.employeeSize) {
          this.form.get('employeeSize')?.setValue(this.editData.employeeSize.toString());
        }
      },
      error: () => {
        console.error('Error fetching employee size options');
        Swal.fire({
          title: 'Lỗi',
          text: 'Không thể tải danh sách quy mô nhân sự',
          icon: 'error',
          confirmButtonText: 'Đóng',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700'
          }
        });
      }
    });
  }

  fetchDistricts(cityId: string) {
    if (!cityId) {
      this.districtOptions = [];
      this.form.get('location.district')?.setValue('');
      return of([]);
    }
    const numericCityId = Number(cityId);
    if (isNaN(numericCityId)) {
      this.districtOptions = [];
      this.form.get('location.district')?.setValue('');
      return of([]);
    }
    return this.commonService.getDistrictsByCityId(numericCityId).pipe(
      timeout(5000),
      takeUntil(this.destroy$),
      tap({
        next: (res) => {
          this.districtOptions = res.data || [];
        },
        error: () => {
          console.error('Error fetching districts');
          this.districtOptions = [];
          this.form.get('location.district')?.setValue('');
          Swal.fire({
            title: 'Lỗi',
            text: 'Không thể tải danh sách quận/huyện',
            icon: 'error',
            confirmButtonText: 'Đóng',
            buttonsStyling: false,
            customClass: {
              confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700'
            }
          });
        }
      })
    );
  }

  onCityChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target?.value || '';
    this.form.get('location.district')?.setValue('');
    this.fetchDistricts(value);
  }

  setServerErrors() {
    if (!this.serverErrors) return;
    Object.entries(this.serverErrors).forEach(([field, error]) => {
      const control = field.includes('.') ? this.form.get(field) : this.form.get(field);
      if (control) {
        control.setErrors({ serverError: Array.isArray(error) ? error.join(' ') : error });
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      Swal.fire({
        title: 'Xác nhận',
        text: 'Bạn có chắc muốn lưu thông tin công ty?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Lưu',
        cancelButtonText: 'Hủy',
        buttonsStyling: false,
        customClass: {
          confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700',
          cancelButton: 'bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 mr-2'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.handleSave.emit(this.form.value);
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

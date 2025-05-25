import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from '../../../../_services/common.service';
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
    private commonService: CommonService
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
            confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700'
          }
        });
      },
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = { ...this.form.value };
      // Remove empty or null values
      Object.keys(formValue).forEach((key) => {
        if (formValue[key] === '' || formValue[key] === null) {
          delete formValue[key];
        }
      });
      this.handleFilter.emit(formValue);
    } else {
      Swal.fire({
        title: 'Cảnh báo',
        text: 'Vui lòng nhập dữ liệu hợp lệ!',
        icon: 'warning',
        confirmButtonText: 'Đóng',
        buttonsStyling: false,
        customClass: {
          confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700'
        }
      });
    }
  }

  onReset() {
    this.form.reset({
      kw: null,
      salaryMax: null,
      experienceId: null,
      cityId: null,
    });
    this.handleFilter.emit({});
  }
}

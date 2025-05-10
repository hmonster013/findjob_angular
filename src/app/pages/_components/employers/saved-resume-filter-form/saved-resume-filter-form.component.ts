import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from '../../../../_services/common.service';
import { ToastrService } from 'ngx-toastr';

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
    private toastr: ToastrService
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
        this.toastr.error('Không thể tải cấu hình bộ lọc!');
      },
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = { ...this.form.value };
      // Loại bỏ các giá trị rỗng hoặc null
      Object.keys(formValue).forEach((key) => {
        if (formValue[key] === '' || formValue[key] === null) {
          delete formValue[key];
        }
      });
      this.handleFilter.emit(formValue);
    } else {
      this.toastr.warning('Vui lòng nhập dữ liệu hợp lệ!');
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

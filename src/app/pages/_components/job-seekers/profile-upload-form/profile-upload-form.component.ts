import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-upload-form',
  standalone: true,
  templateUrl: './profile-upload-form.component.html',
  styleUrls: ['./profile-upload-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class ProfileUploadFormComponent implements OnInit {
  @Input() allConfig: any;
  @Output() submitForm = new EventEmitter<any>();
  @Output() cancelForm = new EventEmitter<void>();

  form: FormGroup;
  fileError = '';
  selectedFileName: string | null = null;
  maxFileSize = 5 * 1024 * 1024; // 5MB

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        file: [null, Validators.required],
        title: ['', [Validators.required, Validators.maxLength(200)]],
        position: ['', Validators.required],
        academicLevel: ['', Validators.required],
        experience: ['', Validators.required],
        career: ['', Validators.required],
        city: ['', Validators.required],
        salaryMin: [null, [Validators.required, Validators.min(0)]],
        salaryMax: [null, [Validators.required, Validators.min(0)]],
        typeOfWorkplace: ['', Validators.required],
        jobType: ['', Validators.required],
        description: ['', [Validators.required, Validators.maxLength(800)]],
      },
      { validators: [this.salaryValidator()] }
    );
  }

  ngOnInit(): void {
    // Nghe sự kiện thay đổi của salaryMin và salaryMax để cập nhật validation
    this.form.get('salaryMin')?.valueChanges.subscribe(() => {
      this.form.updateValueAndValidity({ onlySelf: true });
    });
    this.form.get('salaryMax')?.valueChanges.subscribe(() => {
      this.form.updateValueAndValidity({ onlySelf: true });
    });
  }

  salaryValidator() {
    return (group: FormGroup) => {
      const minControl = group.controls['salaryMin'];
      const maxControl = group.controls['salaryMax'];
      const min = minControl?.value;
      const max = maxControl?.value;

      if (min !== null && max !== null && min >= max) {
        minControl.setErrors({ invalid: true });
        maxControl.setErrors({ invalid: true });
        return { salaryInvalid: true };
      } else {
        // Xóa lỗi 'invalid' nếu trước đó đã đặt
        if (minControl.errors?.['invalid']) {
          const minErrors = { ...minControl.errors };
          delete minErrors['invalid'];
          minControl.setErrors(Object.keys(minErrors).length ? minErrors : null);
        }
        if (maxControl.errors?.['invalid']) {
          const maxErrors = { ...maxControl.errors };
          delete maxErrors['invalid'];
          maxControl.setErrors(Object.keys(maxErrors).length ? maxErrors : null);
        }
        return null;
      }
    };
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type !== 'application/pdf') {
        this.fileError = 'Chỉ chấp nhận file PDF.';
        this.form.patchValue({ file: null });
        this.selectedFileName = null;
        return;
      }
      if (file.size > this.maxFileSize) {
        this.fileError = 'Kích thước file không được vượt quá 5MB.';
        this.form.patchValue({ file: null });
        this.selectedFileName = null;
        return;
      }
      this.form.patchValue({ file });
      this.fileError = '';
      this.selectedFileName = file.name;
    } else {
      this.fileError = 'Tập tin là bắt buộc.';
      this.form.patchValue({ file: null });
      this.selectedFileName = null;
    }
  }

  clearFile(): void {
    this.form.patchValue({ file: null });
    this.selectedFileName = null;
    this.fileError = '';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.fileError = this.form.controls['file'].errors ? 'Tập tin là bắt buộc.' : '';
      this.form.markAllAsTouched();
      return;
    }
    this.submitForm.emit(this.form.value);
  }

  cancel(): void {
    this.form.reset();
    this.fileError = '';
    this.selectedFileName = null;
    this.cancelForm.emit();
  }
}

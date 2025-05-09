import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-upload-form',
  standalone: true,
  templateUrl: './profile-upload-form.component.html',
  styleUrls: ['./profile-upload-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class ProfileUploadFormComponent {
  @Input() allConfig: any;
  @Output() submitForm = new EventEmitter<any>();
  @Output() cancelForm = new EventEmitter<void>();

  form: FormGroup;
  fileError = '';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
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
    }, { validators: [this.salaryValidator()] });
  }

  salaryValidator() {
    return (group: FormGroup) => {
      const min = group.controls['salaryMin']?.value;
      const max = group.controls['salaryMax']?.value;
      if (min !== null && max !== null && min >= max) {
        group.controls['salaryMin'].setErrors({ invalid: true });
        group.controls['salaryMax'].setErrors({ invalid: true });
      } else {
        group.controls['salaryMin'].setErrors(null);
        group.controls['salaryMax'].setErrors(null);
      }
      return null;
    };
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.form.patchValue({ file });
      this.fileError = '';
    } else {
      this.fileError = 'Tập tin là bắt buộc.';
      this.form.patchValue({ file: null });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.fileError = this.form.controls['file'].errors ? 'Tập tin là bắt buộc.' : '';
      this.form.markAllAsTouched();
      return;
    }
    this.submitForm.emit(this.form.value);
  }

  cancel() {
    this.form.reset();
    this.fileError = '';
    this.cancelForm.emit();
  }
}

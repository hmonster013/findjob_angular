import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password-form.component.html',
})
export class ForgotPasswordFormComponent {
  @Output() submitForm = new EventEmitter<{ email: string }>();

  form: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get emailError(): string | null {
    const control = this.form.get('email');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'Email là bắt buộc';
      if (control.errors['email']) return 'Email không hợp lệ';
    }
    return null;
  }

  handleSubmit() {
    if (this.form.valid && !this.isLoading) {
      this.isLoading = true;
      this.submitForm.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  // Reset loading state
  resetLoading() {
    this.isLoading = false;
  }
}

import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employer-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employer-login-form.component.html',
})
export class EmployerLoginFormComponent {
  @Output() submitForm = new EventEmitter<{ email: string; password: string }>();
  @Output() resetSubmittingEvent = new EventEmitter<void>(); // Emit khi cần reset

  loginForm: FormGroup;
  isSubmitting = false;
  showPassword = false;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(128),
          // Comment để nới lỏng yêu cầu mật khẩu, bỏ comment nếu muốn giữ
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/),
        ],
      ],
    });
  }

  onSubmit() {
    console.log('Submitting, isSubmitting:', this.isSubmitting);
    console.log('Form valid:', this.loginForm.valid);
    console.log('Form value:', this.loginForm.value);
    console.log('Email errors:', this.loginForm.get('email')?.errors);
    console.log('Password errors:', this.loginForm.get('password')?.errors);

    if (this.loginForm.valid) {
      this.isSubmitting = true;
      this.submitForm.emit(this.loginForm.value);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  resetSubmitting() {
    console.log('Resetting isSubmitting');
    this.isSubmitting = false;
    this.resetSubmittingEvent.emit();
  }
}

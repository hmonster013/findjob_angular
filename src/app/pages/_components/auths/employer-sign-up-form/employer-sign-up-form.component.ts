import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-employer-sign-up-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employer-sign-up-form.component.html',
})
export class EmployerSignUpFormComponent {
  @Output() submitForm = new EventEmitter<any>();
  @Output() checkCreds = new EventEmitter<string>();
  @Input() serverErrors: any = {};

  signUpForm: FormGroup;
  currentStep = 1;
  isSubmitting = false;
  showPassword = false;
  showConfirmPassword = false;
  lastCheckedEmail = '';

  constructor(private fb: FormBuilder) {
    this.signUpForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(128),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/),
          ],
        ],
        confirmPassword: ['', Validators.required],
        name: ['', Validators.required],
        phone: ['', Validators.required],
        website: [''],
        companyName: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  get emailControl() {
    return this.signUpForm.get('email');
  }

  passwordMatchValidator(form: FormGroup): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  handleNextStep() {
    if (this.currentStep === 1) {
      if (
        this.signUpForm.get('email')?.valid &&
        this.signUpForm.get('password')?.valid &&
        this.signUpForm.get('confirmPassword')?.valid &&
        !this.serverErrors.email
      ) {
        this.currentStep = 2;
      } else {
        this.signUpForm.markAllAsTouched();
      }
    } else if (this.currentStep === 2) {
      if (this.signUpForm.valid) {
        this.isSubmitting = true;
        this.submitForm.emit(this.signUpForm.value);
      } else {
        this.signUpForm.markAllAsTouched();
      }
    }
  }

  handleCheckCreds() {
    const email = this.signUpForm.get('email')?.value;
    if (email && this.signUpForm.get('email')?.valid && email !== this.lastCheckedEmail) {
      this.lastCheckedEmail = email;
      this.checkCreds.emit(email);
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}

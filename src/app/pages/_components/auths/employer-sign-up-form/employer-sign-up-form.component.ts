import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(128),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
      ]],
      confirmPassword: ['', Validators.required],
      name: ['', Validators.required],
      phone: ['', Validators.required],
      website: [''],
      companyName: ['', Validators.required]
    });
  }

  get emailControl() {
    return this.signUpForm.get('email');
  }

  handleNextStep() {
    if (this.currentStep === 1) {
      if (this.signUpForm.get('email')?.valid && this.signUpForm.get('password')?.valid && this.signUpForm.get('confirmPassword')?.valid) {
        this.currentStep = 2;
      } else {
        this.signUpForm.markAllAsTouched();
      }
    } else if (this.currentStep === 2) {
      if (this.signUpForm.valid) {
        this.submitForm.emit(this.signUpForm.value);
      } else {
        this.signUpForm.markAllAsTouched();
      }
    }
  }

  handleCheckCreds() {
    const email = this.signUpForm.get('email')?.value;
    if (email) {
      this.checkCreds.emit(email);
    }
  }
}

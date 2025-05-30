import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidationErrors } from '@angular/forms';

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

  // Danh sách tùy chọn giả định (lấy từ backend hoặc config)
  cities = [
    { id: 1, name: 'Hà Nội' },
    { id: 2, name: 'TP.HCM' },
    // Thêm các tỉnh/thành khác
  ];
  districts = [
    { id: 1, name: 'Quận 1', cityId: 2 },
    { id: 2, name: 'Quận 3', cityId: 2 },
    // Thêm các quận/huyện khác
  ];
  employeeSizes = [
    { id: 1, name: 'Dưới 10 nhân viên' },
    { id: 2, name: '10 - 150 nhân viên' },
    { id: 3, name: '150 - 300 nhân viên' },
    { id: 4, name: 'Trên 300 nhân viên' },
  ];

  constructor(private fb: FormBuilder) {
    this.signUpForm = this.fb.group(
      {
        fullName: ['', [Validators.required, Validators.maxLength(100)]],
        email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
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
        platform: ['web', Validators.required], // Giả định platform là 'web'
        companyName: ['', [Validators.required, Validators.maxLength(255)]],
        companyEmail: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
        companyPhone: ['', [Validators.maxLength(15)]],
        taxCode: ['', [Validators.required, Validators.maxLength(30)]],
        since: [''],
        fieldOperation: ['', Validators.maxLength(255)],
        employeeSize: ['', Validators.required],
        websiteUrl: ['', Validators.maxLength(300)],
        city: ['', Validators.required],
        district: [''],
        address: ['', Validators.required],
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
      const step1Controls = ['fullName', 'email', 'password', 'confirmPassword'];
      let isValid = true;
      step1Controls.forEach(control => {
        this.signUpForm.get(control)?.markAsTouched();
        if (this.signUpForm.get(control)?.invalid) isValid = false;
      });
      if (isValid && !this.serverErrors.email) {
        this.currentStep = 2;
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

  // Lọc quận/huyện theo tỉnh/thành
  getFilteredDistricts() {
    const cityId = this.signUpForm.get('city')?.value;
    return this.districts.filter(district => district.cityId === cityId);
  }
}

// employer-sign-up-form.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { CommonService } from '../../../../_services/common.service';

@Component({
  selector: 'app-employer-sign-up-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employer-sign-up-form.component.html',
})
export class EmployerSignUpFormComponent implements OnInit {
  @Output() submitForm = new EventEmitter<any>();
  @Output() checkCreds = new EventEmitter<string>();
  @Input() serverErrors: any = {};

  signUpForm: FormGroup;
  currentStep = 1;
  isSubmitting = false;
  showPassword = false;
  showConfirmPassword = false;
  lastCheckedEmail = '';

  // Configuration data
  cities: any[] = [];
  districts: any[] = [];
  employeeSizes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService
  ) {
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
        platform: ['web', Validators.required],
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

    // Watch for city changes to fetch districts
    this.signUpForm.get('city')?.valueChanges.subscribe(cityId => {
      if (cityId) {
        this.fetchDistricts(cityId);
      } else {
        this.districts = [];
        this.signUpForm.get('district')?.setValue('');
      }
    });
  }

  ngOnInit(): void {
    this.getConfigs();
  }

  get emailControl() {
    return this.signUpForm.get('email');
  }

  getConfigs() {
    this.commonService.getConfigs().subscribe({
      next: (res) => {
        if (res.data) {
          this.cities = res.data.cityOptions || [];
          this.employeeSizes = res.data.employeeSizeOptions || [];
        }
      },
      error: (err) => {
        console.error('Error fetching configs:', err);
      }
    });
  }

  fetchDistricts(cityId: number) {
    this.commonService.getDistrictsByCityId(cityId).subscribe({
      next: (res) => {
        this.districts = res.data || [];
        // Reset district if current value is not valid
        const currentDistrict = this.signUpForm.get('district')?.value;
        if (currentDistrict && !this.districts.find(d => d.id === currentDistrict)) {
          this.signUpForm.get('district')?.setValue('');
        }
      },
      error: (err) => {
        console.error('Error fetching districts:', err);
        this.districts = [];
        this.signUpForm.get('district')?.setValue('');
      }
    });
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

  getFilteredDistricts() {
    return this.districts;
  }
}

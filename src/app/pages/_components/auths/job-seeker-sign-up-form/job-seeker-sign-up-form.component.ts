import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PLATFORM } from '../../../../_configs/constants';

@Component({
  selector: 'app-job-seeker-sign-up-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './job-seeker-sign-up-form.component.html',
})
export class JobSeekerSignUpFormComponent implements OnInit {
  @Input() serverErrors: any = null;
  @Output() submitForm = new EventEmitter<any>();
  @Output() facebookRegister = new EventEmitter<string>();
  @Output() googleRegister = new EventEmitter<string>();

  form: FormGroup;
  isLoadingEmail = false;
  isLoadingFacebook = false;
  isLoadingGoogle = false;
  showPassword = false; // Biến để kiểm soát trạng thái xem/ẩn mật khẩu
  showConfirmPassword = false; // Biến để kiểm soát trạng thái xem/ẩn xác nhận mật khẩu

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        fullName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        platform: [PLATFORM, Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    // Lắng nghe postMessage từ popup
    window.addEventListener('message', this.handleSocialRegisterMessage.bind(this));
  }

  ngOnDestroy(): void {
    // Xóa listener khi component bị hủy
    window.removeEventListener('message', this.handleSocialRegisterMessage.bind(this));
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  handleSubmit() {
    if (this.form.valid && !this.isLoadingEmail) {
      this.isLoadingEmail = true;
      this.submitForm.emit(this.form.value);
    }
  }

  handleFacebookLogin() {
    if (this.isLoadingFacebook) return;
    this.isLoadingFacebook = true;
    window.open('/auth/facebook', '_blank', 'width=500,height=600');
  }

  handleGoogleLogin() {
    if (this.isLoadingGoogle) return;
    this.isLoadingGoogle = true;
    window.open('/auth/google', '_blank', 'width=500,height=600');
  }

  private handleSocialRegisterMessage(event: MessageEvent) {
    if (event.data.type === 'social_register') {
      const { provider, token } = event.data;
      if (provider === 'facebook') {
        this.facebookRegister.emit(token);
        this.isLoadingFacebook = false;
      } else if (provider === 'google') {
        this.googleRegister.emit(token);
        this.isLoadingGoogle = false;
      }
    }
  }

  // Chức năng xem/ẩn mật khẩu
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Chức năng xem/ẩn xác nhận mật khẩu
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Reset loading state
  resetLoadingEmail() {
    this.isLoadingEmail = false;
  }
}

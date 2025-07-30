import { Component, OnInit, Output, EventEmitter, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { PLATFORM, AUTH_CONFIG } from '../../../../_configs/constants';

declare const google: any;
declare const FB: any;

@Component({
  selector: 'app-job-seeker-sign-up-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './job-seeker-sign-up-form.component.html',
})
export class JobSeekerSignUpFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() serverErrors: any = null;
  @Output() submitForm = new EventEmitter<any>();
  @Output() facebookRegister = new EventEmitter<string>();
  @Output() googleRegister = new EventEmitter<string>();

  form: FormGroup;
  isLoadingEmail = false;
  isLoadingFacebook = false;
  isLoadingGoogle = false;
  showPassword = false;
  showConfirmPassword = false;

  AUTH_CONFIG = AUTH_CONFIG;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
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
    // No initialization needed for social login here
  }

  ngAfterViewInit(): void {
    // Initialize Google Sign-In
    if (typeof google !== 'undefined' && google.accounts && google.accounts.oauth2) {
      const client = google.accounts.oauth2.initCodeClient({
        client_id: AUTH_CONFIG.GOOGLE_CLIENT_ID,
        scope: 'profile email',
        ux_mode: 'popup',
        callback: (response: any) => {
          console.log('Google response:', response);
          if (response.code) {
            this.isLoadingGoogle = true;
            this.googleRegister.emit(response.code);
          } else {
            this.toastr.error('Đăng ký bằng Google thất bại.');
            this.isLoadingGoogle = false;
          }
        },
      });
      document.getElementById('googleSignUpButton')?.addEventListener('click', () => {
        client.requestCode();
      });
    } else {
      console.error('Google Identity Services script not loaded.');
      this.toastr.error('Không thể tải Google Sign-In. Vui lòng thử lại sau.');
    }
  }

  ngOnDestroy(): void {
    // Cleanup if needed (e.g., remove event listeners)
    const googleButton = document.getElementById('googleSignUpButton');
    if (googleButton) {
      googleButton.removeEventListener('click', () => {});
    }
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

    // Gọi Facebook Login
    FB.login(
      (response: any) => {
        if (response.status === 'connected' && response.authResponse) {
          const accessToken = response.authResponse.accessToken;
          console.log('Facebook access token:', accessToken);
          this.facebookRegister.emit(accessToken);
        } else {
          this.toastr.error('Đăng ký bằng Facebook thất bại.');
          this.isLoadingFacebook = false;
        }
      },
      { scope: 'public_profile,email' }
    );
  }

  handleGoogleLogin() {
    // The actual Google login is handled by the button click event in ngAfterViewInit
    // This method is just a placeholder to keep the button's (click) binding
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  resetLoadingEmail() {
    this.isLoadingEmail = false;
  }
}

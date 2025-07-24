import { Component, Output, EventEmitter, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AUTH_CONFIG } from '../../../../_configs/constants';

declare const google: any;
declare const FB: any;

@Component({
  selector: 'app-job-seeker-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './job-seeker-login-form.component.html',
})
export class JobSeekerLoginFormComponent implements OnInit, OnDestroy, AfterViewInit {
  form: FormGroup;
  isLoadingEmail = false;
  isLoadingFacebook = false;
  isLoadingGoogle = false;
  showPassword = false;

  @Output() submitForm = new EventEmitter<{ email: string; password: string }>();
  @Output() facebookLogin = new EventEmitter<string>();
  @Output() googleLogin = new EventEmitter<string>();

  AUTH_CONFIG = AUTH_CONFIG;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Không cần loadDiscoveryDocumentAndTryLogin nữa
  }

  ngAfterViewInit(): void {
    if (typeof google !== 'undefined' && google.accounts && google.accounts.oauth2) {
      const client = google.accounts.oauth2.initCodeClient({
        client_id: AUTH_CONFIG.GOOGLE_CLIENT_ID,
        scope: 'profile email', // Kiểm tra scope với backend
        ux_mode: 'popup',
        callback: (response: any) => {
          console.log('Google response:', response);
          if (response.code) {
            this.isLoadingGoogle = true;
            this.googleLogin.emit(response.code);
          } else {
            this.toastr.error('Đăng nhập Google thất bại.');
            this.isLoadingGoogle = false;
          }
        },
      });
      document.getElementById('googleSignInButton')?.addEventListener('click', () => {
        client.requestCode();
      });
    } else {
      console.error('Google Identity Services script not loaded.');
      this.toastr.error('Không thể tải Google Sign-In. Vui lòng thử lại sau.');
    }
  }

  ngOnDestroy(): void {
    // Không cần unsubscribe nữa
  }

  handleSubmit() {
    if (this.form.valid && !this.isLoadingEmail) {
      this.isLoadingEmail = true;
      this.submitForm.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
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
          this.facebookLogin.emit(accessToken);
        } else {
          this.toastr.error('Đăng nhập bằng Facebook thất bại.');
          this.isLoadingFacebook = false;
        }
      },
      { scope: 'public_profile,email' } // Yêu cầu các quyền cần thiết
    );
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  resetLoadingEmail() {
    this.isLoadingEmail = false;
  }
}

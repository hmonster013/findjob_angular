import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { JobSeekerLoginFormComponent } from '../../_components/auths/job-seeker-login-form/job-seeker-login-form.component';
import { AuthenticationService } from '../../../_services/authentication.service';
import { TokenService } from '../../../_services/token.service';
import { AuthStateService } from '../../../_services/auth-state.service';
import { AUTH_CONFIG, ROLES_NAME } from '../../../_configs/constants';

@Component({
  selector: 'app-job-seeker-login-page',
  standalone: true,
  imports: [
    CommonModule,
    JobSeekerLoginFormComponent
  ],
  templateUrl: './job-seeker-login-page.component.html',
  styleUrls: ['./job-seeker-login-page.component.css']
})
export class JobSeekerLoginPageComponent implements OnInit {
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthenticationService,
    private tokenService: TokenService,
    private authStateService: AuthStateService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParams;
    this.successMessage = queryParams['success'] || null;
    this.errorMessage = queryParams['error'] || null;
  }

  onLogin(formData: { email: string; password: string }) {
    this.isLoading = true;

    this.authService.checkCreds(formData.email, ROLES_NAME.JOB_SEEKER).subscribe({
      next: (res) => {
        if (res.data.exists && res.data.email_verified === false) {
          this.authStateService.setCurrentUser({ email: formData.email });
          this.router.navigate(['/email-verification']);
          this.isLoading = false;
        } else if (res.data.exists && res.data.email_verified === true) {
          this.getAccessToken(formData);
        } else {
          this.toastr.warning('Tài khoản không tồn tại hoặc sai thông tin.');
          this.isLoading = false;
        }
      },
      error: () => {
        this.toastr.error('Đã xảy ra lỗi, vui lòng đăng nhập lại!');
        this.isLoading = false;
      }
    });
  }

  getAccessToken(formData: { email: string; password: string }) {
    this.authService.getToken(formData.email, formData.password, ROLES_NAME.JOB_SEEKER).subscribe({
      next: (res) => {
        if (res.data.access_token) {
          this.tokenService.saveAccessTokenAndRefreshTokenToCookie(
            res.data.access_token,
            res.data.refresh_token,
            'email'
          );
          this.authService.getUserInfo().subscribe({
            next: (userInfoRes) => {
              this.authStateService.setCurrentUser(userInfoRes.data);
              this.router.navigate(['/']);
              this.toastr.success('Đăng nhập thành công!');
              this.isLoading = false;
            },
            error: () => {
              this.toastr.error('Không thể lấy thông tin người dùng.');
              this.isLoading = false;
            }
          });
        } else {
          this.errorMessage = res.errorMessage || 'Đăng nhập thất bại.';
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.errorMessage || 'Đăng nhập thất bại.';
        this.isLoading = false;
      }
    });
  }

  onFacebookLogin(accessToken: string) {
    this.socialLogin('facebook', accessToken);
  }

  onGoogleLogin(accessToken: string) {
    this.socialLogin('google-oauth2', accessToken);
  }

  private socialLogin(provider: string, token: string) {
    this.isLoading = true;

    this.authService.convertToken(
      AUTH_CONFIG.CLIENT_ID,   // ✅ Chuẩn lấy từ constants
      AUTH_CONFIG.CLIENT_SECRET, // ✅ Chuẩn lấy từ constants
      provider,
      token
    ).subscribe({
      next: (res) => {
        if (res.data.access_token) {
          this.tokenService.saveAccessTokenAndRefreshTokenToCookie(
            res.data.access_token,
            res.data.refresh_token,
            provider
          );
          this.authService.getUserInfo().subscribe({
            next: (userInfoRes) => {
              this.authStateService.setCurrentUser(userInfoRes.data);
              this.router.navigate(['/']);
              this.toastr.success('Đăng nhập thành công!');
              this.isLoading = false;
            },
            error: () => {
              this.toastr.error('Không thể lấy thông tin người dùng.');
              this.isLoading = false;
            }
          });
        } else {
          this.toastr.error('Đăng nhập bằng mạng xã hội thất bại.');
          this.isLoading = false;
        }
      },
      error: () => {
        this.toastr.error('Đăng nhập bằng mạng xã hội thất bại.');
        this.isLoading = false;
      }
    });
  }
}

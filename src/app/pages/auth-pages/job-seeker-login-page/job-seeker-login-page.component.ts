import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { JobSeekerLoginFormComponent } from '../../_components/auths/job-seeker-login-form/job-seeker-login-form.component';
import { AuthenticationService } from '../../../_services/authentication.service';
import { TokenService } from '../../../_services/token.service';
import { AuthStateService } from '../../../_services/auth-state.service';
import { AUTH_CONFIG, ROLES_NAME, ROUTES } from '../../../_configs/constants';

@Component({
  selector: 'app-job-seeker-login-page',
  standalone: true,
  imports: [CommonModule, JobSeekerLoginFormComponent],
  templateUrl: './job-seeker-login-page.component.html',
})
export class JobSeekerLoginPageComponent implements OnInit {
  isLoadingEmail = false;
  isLoadingFacebook = false;
  isLoadingGoogle = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  ROUTES = ROUTES;

  constructor(
    private authService: AuthenticationService,
    private tokenService: TokenService,
    private authStateService: AuthStateService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.successMessage = params['success'] || null;
      this.errorMessage = params['error'] || null;
    });
  }

  onLogin(formData: { email: string; password: string }) {
    this.isLoadingEmail = true;
    this.errorMessage = null; // Xóa lỗi trước khi gửi yêu cầu

    this.authService.checkCreds(formData.email, ROLES_NAME.JOB_SEEKER).subscribe({
      next: (res) => {
        if (res.data.exists && !res.data.email_verified) {
          this.authStateService.setCurrentUser({ email: formData.email });
          this.router.navigate([`/${ROUTES.AUTH.EMAIL_VERIFICATION}`]);
          this.isLoadingEmail = false;
        } else if (res.data.exists && res.data.email_verified) {
          this.getAccessToken(formData);
        } else {
          this.errorMessage = 'Tài khoản không tồn tại hoặc sai thông tin';
          this.toastr.warning(this.errorMessage);
          this.isLoadingEmail = false;
        }
      },
      error: () => {
        this.errorMessage = 'Đã xảy ra lỗi, vui lòng thử lại';
        this.toastr.error(this.errorMessage);
        this.isLoadingEmail = false;
      },
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
              this.isLoadingEmail = false;
            },
            error: () => {
              this.errorMessage = 'Không thể lấy thông tin người dùng';
              this.toastr.error(this.errorMessage);
              this.isLoadingEmail = false;
            },
          });
        } else {
          this.errorMessage = res.errorMessage || 'Đăng nhập thất bại';
          this.toastr.error(this.errorMessage || "");
          this.isLoadingEmail = false;
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.errorMessage || 'Đăng nhập thất bại';
        this.toastr.error(this.errorMessage || "");
        this.isLoadingEmail = false;
      },
    });
  }

  onFacebookLogin(accessToken: string) {
    this.isLoadingFacebook = true;
    this.errorMessage = null;
    this.socialLogin('facebook', accessToken);
  }

  onGoogleLogin(accessToken: string) {
    this.isLoadingGoogle = true;
    this.errorMessage = null;
    this.socialLogin('google-oauth2', accessToken);
  }

  private socialLogin(provider: string, token: string) {
    this.authService
      .convertToken(AUTH_CONFIG.CLIENT_ID, AUTH_CONFIG.CLIENT_SECRET, provider, token)
      .subscribe({
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
                this.isLoadingFacebook = false;
                this.isLoadingGoogle = false;
              },
              error: () => {
                this.errorMessage = 'Không thể lấy thông tin người dùng';
                this.toastr.error(this.errorMessage);
                this.isLoadingFacebook = false;
                this.isLoadingGoogle = false;
              },
            });
          } else {
            this.errorMessage = 'Đăng nhập bằng mạng xã hội thất bại';
            this.toastr.error(this.errorMessage);
            this.isLoadingFacebook = false;
            this.isLoadingGoogle = false;
          }
        },
        error: () => {
          this.errorMessage = 'Đăng nhập bằng mạng xã hội thất bại';
          this.toastr.error(this.errorMessage);
          this.isLoadingFacebook = false;
          this.isLoadingGoogle = false;
        },
      });
  }

  get isLoading(): boolean {
    return this.isLoadingEmail || this.isLoadingFacebook || this.isLoadingGoogle;
  }

  navigateToForgotPassword() {
    this.router.navigate([`/${ROUTES.AUTH.FORGOT_PASSWORD}`]);
  }

  navigateToRegister() {
    this.router.navigate([`/${ROUTES.AUTH.REGISTER}`]);
  }
}

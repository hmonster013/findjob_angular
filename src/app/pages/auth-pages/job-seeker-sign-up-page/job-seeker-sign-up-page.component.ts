import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { JobSeekerSignUpFormComponent } from '../../_components/auths/job-seeker-sign-up-form/job-seeker-sign-up-form.component';
import { AuthenticationService } from '../../../_services/authentication.service';
import { TokenService } from '../../../_services/token.service';
import { AuthStateService } from '../../../_services/auth-state.service';
import { AUTH_CONFIG, IMAGES, ROUTES } from '../../../_configs/constants';

@Component({
  selector: 'app-job-seeker-sign-up-page',
  standalone: true,
  imports: [CommonModule, JobSeekerSignUpFormComponent],
  templateUrl: './job-seeker-sign-up-page.component.html',
})
export class JobSeekerSignUpPageComponent {
  isLoading = false;
  errorMessage: string | null = null;
  serverErrors: any = null;

  ROUTES = ROUTES;
  IMAGES = IMAGES;

  constructor(
    private authService: AuthenticationService,
    private tokenService: TokenService,
    private authStateService: AuthStateService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onRegister(data: any) {
    this.isLoading = true;
    this.errorMessage = null;
    this.serverErrors = null;

    this.authService.jobSeekerRegister(data).subscribe({
      next: (res) => {
        // Kiểm tra nếu errors là object rỗng và data là null
        if (res.errors && Object.keys(res.errors).length === 0 && res.data === null) {
          this.router.navigate(['/email-verification']);
          this.toastr.success('Đăng ký thành công!');
        } else {
          this.errorMessage = res.message || 'Đăng ký thất bại';
          this.serverErrors = res.errors || null;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Đăng ký thất bại';
        this.serverErrors = err.error?.errors || null;
        this.isLoading = false;
      },
    });
  }

  onFacebookRegister(accessToken: string) {
    this.handleSocialRegister('facebook', accessToken);
  }

  onGoogleRegister(accessToken: string) {
    this.handleSocialRegister('google-oauth2', accessToken);
  }

  private handleSocialRegister(provider: string, token: string) {
    this.isLoading = true;

    this.authService
      .convertToken(provider, token)
      .subscribe({
        next: (res) => {
          if (res.access_token) {
            this.tokenService.saveAccessTokenAndRefreshTokenToCookie(
              res.access_token,
              res.refresh_token,
              provider
            );
            this.authService.getUserInfo().subscribe({
              next: (userInfoRes) => {
                this.authStateService.setCurrentUser(userInfoRes.data);
                this.router.navigate(['/']);
                this.toastr.success('Đăng ký thành công!');
                this.isLoading = false;
              },
              error: () => {
                this.toastr.error('Không thể lấy thông tin người dùng.');
                this.isLoading = false;
              },
            });
          } else {
            this.errorMessage = 'Đăng ký mạng xã hội thất bại';
            this.isLoading = false;
          }
        },
        error: () => {
          this.errorMessage = 'Đăng ký mạng xã hội thất bại';
          this.isLoading = false;
        },
      });
  }

  // Phương thức điều hướng đến trang đăng nhập
  navigateToLogin() {
    this.router.navigate([`/${ROUTES.AUTH.LOGIN}`]);
  }
}

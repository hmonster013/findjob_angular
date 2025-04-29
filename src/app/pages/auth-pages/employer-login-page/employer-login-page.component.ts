import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployerLoginFormComponent } from '../../_components/auths/employer-login-form/employer-login-form.component';
import { AuthenticationService } from '../../../_services/authentication.service';
import { TokenService } from '../../../_services/token.service';
import { AuthStateService } from '../../../_services/auth-state.service';
import { ROLES_NAME } from '../../../_configs/constants';

@Component({
  selector: 'app-employer-login-page',
  standalone: true,
  imports: [
    CommonModule,
    EmployerLoginFormComponent
  ],
  templateUrl: './employer-login-page.component.html',
  styleUrls: ['./employer-login-page.component.css'],
})
export class EmployerLoginPageComponent {
  isLoading = false;

  constructor(
    private authService: AuthenticationService,
    private tokenService: TokenService,
    private authStateService: AuthStateService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  onLogin(formData: { email: string; password: string }) {
    this.isLoading = true;

    const { email, password } = formData;
    const role = ROLES_NAME.EMPLOYER;

    this.authService.checkCreds(email, role).subscribe({
      next: (res) => {
        if (res.status) {
          this.authService.getToken(email, password, role).subscribe({
            next: (tokenRes) => {
              this.tokenService.saveAccessTokenAndRefreshTokenToCookie(
                tokenRes.access_token,
                tokenRes.refresh_token,
                'email' // provider mặc định email (nếu login normal)
              );

              this.authService.getUserInfo().subscribe({
                next: (userInfo) => {
                  if (userInfo.data?.is_verified === false) {
                    this.router.navigate(['/email-verification']);
                  } else {
                    this.authStateService.setCurrentUser(userInfo.data);
                    this.toastr.success('Đăng nhập thành công!');
                    this.router.navigate(['/employer/dashboard']);
                  }
                  this.isLoading = false;
                },
                error: () => {
                  this.toastr.error('Không thể lấy thông tin tài khoản');
                  this.isLoading = false;
                }
              });
            },
            error: () => {
              this.toastr.error('Không thể đăng nhập, vui lòng kiểm tra lại thông tin');
              this.isLoading = false;
            }
          });
        } else {
          this.toastr.error(res.message || 'Thông tin đăng nhập không hợp lệ');
          this.isLoading = false;
        }
      },
      error: () => {
        this.toastr.error('Đăng nhập thất bại');
        this.isLoading = false;
      }
    });
  }
}

import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployerLoginFormComponent } from '../../_components/auths/employer-login-form/employer-login-form.component';
import { AuthenticationService } from '../../../_services/authentication.service';
import { TokenService } from '../../../_services/token.service';
import { AuthStateService } from '../../../_services/auth-state.service';
import { IMAGES, ROLES_NAME } from '../../../_configs/constants';

@Component({
  selector: 'app-employer-login-page',
  standalone: true,
  imports: [
    CommonModule,
    EmployerLoginFormComponent,
    RouterModule
  ],
  templateUrl: './employer-login-page.component.html',
  styleUrls: ['./employer-login-page.component.css'],
})
export class EmployerLoginPageComponent {
  isLoading = false;

  @ViewChild(EmployerLoginFormComponent) employerLoginForm?: EmployerLoginFormComponent;

  IMAGES = IMAGES;

  constructor(
    private authService: AuthenticationService,
    private tokenService: TokenService,
    private authStateService: AuthStateService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  onLogin(formData: { email: string; password: string }) {
    if (!formData.email || !formData.password) {
      this.toastr.error('Vui lòng nhập đầy đủ email và mật khẩu');
      this.employerLoginForm?.resetSubmitting();
      return;
    }

    this.isLoading = true;

    const { email, password } = formData;
    const role = ROLES_NAME.EMPLOYER;

    this.authService.checkCreds(email, role).subscribe({
      next: (res) => {
        console.log('checkCreds response:', res);
        if (res && res.data && res.data.exists) {
          if (res.data.email_verified === false) {
            this.toastr.info('Vui lòng xác minh email để tiếp tục');
            this.router.navigate(['/email-verification']);
            this.isLoading = false;
            this.employerLoginForm?.resetSubmitting();
            return;
          }

          this.authService.getToken(email, password, role).subscribe({
            next: (tokenRes) => {
              console.log('getToken response:', tokenRes);
              this.tokenService.saveAccessTokenAndRefreshTokenToCookie(
                tokenRes.data.access_token,
                tokenRes.data.refresh_token,
                'email'
              );

              this.authService.getUserInfo().subscribe({
                next: (userInfo) => {
                  console.log('getUserInfo response:', userInfo);
                  this.authStateService.setCurrentUser(userInfo.data);
                  this.toastr.success('Đăng nhập thành công!');
                  this.router.navigate(['']);
                  this.isLoading = false;
                  this.employerLoginForm?.resetSubmitting();
                },
                error: (err) => {
                  console.log('getUserInfo error:', err);
                  this.toastr.error('Không thể lấy thông tin tài khoản. Vui lòng thử lại sau.');
                  this.isLoading = false;
                  this.employerLoginForm?.resetSubmitting();
                },
              });
            },
            error: (err) => {
              console.log('getToken error:', err);
              this.toastr.error('Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.');
              this.isLoading = false;
              this.employerLoginForm?.resetSubmitting();
            },
          });
        } else {
          console.log('checkCreds error: Email không tồn tại');
          this.toastr.error('Email không tồn tại. Vui lòng kiểm tra lại hoặc đăng ký.');
          this.isLoading = false;
          this.employerLoginForm?.resetSubmitting();
        }
      },
      error: (err) => {
        console.log('checkCreds HTTP error:', err);
        this.toastr.error('Có lỗi xảy ra khi kiểm tra thông tin. Vui lòng thử lại sau.');
        this.isLoading = false;
        this.employerLoginForm?.resetSubmitting();
      },
    });
  }
}

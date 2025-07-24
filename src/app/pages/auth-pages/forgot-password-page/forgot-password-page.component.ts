import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ForgotPasswordFormComponent } from '../../_components/auths/forgot-password-form/forgot-password-form.component';
import { AuthenticationService } from '../../../_services/authentication.service';
import { IMAGES, PLATFORM, ROUTES } from '../../../_configs/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [
    CommonModule,
    ForgotPasswordFormComponent
  ],
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.css'],
})
export class ForgotPasswordPageComponent {
  messageSuccess: string | null = null;
  isLoading = false;

  ROUTES = ROUTES;
  IMAGES = IMAGES;

  constructor(
    private authService: AuthenticationService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  onSubmit(data: { email: string }) {
    this.isLoading = true;
    this.authService.forgotPassword({
      ...data,
      platform: PLATFORM
    }).subscribe({
      next: () => {
        this.messageSuccess = `Chúng tôi đã gửi email hướng dẫn đến ${data.email}`;
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
        this.isLoading = false;
      }
    });
  }

  // Phương thức điều hướng đến trang đăng nhập
  navigateToLogin() {
    this.router.navigate([`/${ROUTES.AUTH.LOGIN}`]);
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ForgotPasswordFormComponent } from '../../_components/auths/forgot-password-form/forgot-password-form.component';
import { AuthenticationService } from '../../../_services/authentication.service';
import { PLATFORM } from '../../../_configs/constants';

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
  isLoading = false;
  messageSuccess: string | null = null;

  constructor(
    private authService: AuthenticationService,
    private toastr: ToastrService
  ) {}

  onSubmit(formData: { email: string }) {
    this.isLoading = true;

    const payload = {
      ...formData,
      platform: PLATFORM,
    };

    this.authService.forgotPassword(payload).subscribe({
      next: (res) => {
        if (res.status) {
          this.messageSuccess = `Chúng tôi đã gửi email hướng dẫn đến ${formData.email}`;
        } else {
          this.toastr.error(res.message || 'Không thể gửi yêu cầu đặt lại mật khẩu.');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Forgot password error:', error);
        this.toastr.error('Không thể gửi yêu cầu đặt lại mật khẩu.');
        this.isLoading = false;
      }
    });
  }
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../../../_services/authentication.service';
import { AuthStateService } from '../../../../_services/auth-state.service';
import { UpdatePasswordFormComponent } from '../update-password-form/update-password-form.component';
import { AvatarCardComponent } from '../avatar-card/avatar-card.component';
import { AccountFormComponent } from '../account-form/account-form.component';

@Component({
  selector: 'app-account-card',
  imports: [
    CommonModule,
    UpdatePasswordFormComponent,
    AvatarCardComponent,
    AccountFormComponent,
  ],
  templateUrl: './account-card.component.html',
  styleUrls: ['./account-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AccountCardComponent {
  openPopup = false;
  isFullScreenLoading = false;
  serverErrors: any = null;

  constructor(
    private authenticationService: AuthenticationService,
    private authStateService: AuthStateService,
    private toastr: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef // Thêm ChangeDetectorRef
  ) {}

  handleUpdateAccount(data: any) {
    this.isFullScreenLoading = true;
    this.cdr.markForCheck(); // Đánh dấu để kiểm tra thay đổi

    this.authenticationService.updateUser(data).subscribe({
      next: (response) => {
        console.log('Update user response:', response); // Log để kiểm tra
        this.toastr.success('Cập nhật thông tin tài khoản thành công!');
        this.serverErrors = null;

        // Cập nhật localStorage với dữ liệu mới nếu server trả về
        if (response?.data) {
          localStorage.setItem('current_user', JSON.stringify(response.data));
        }
      },
      error: (error) => {
        console.error('Update user error:', error); // Log lỗi
        this.serverErrors = error?.error || { message: 'Có lỗi xảy ra khi cập nhật tài khoản!' };
        this.toastr.error(this.serverErrors.message || 'Có lỗi xảy ra!');
      },
      complete: () => {
        this.isFullScreenLoading = false;
        this.cdr.markForCheck(); // Đảm bảo UI được làm mới
      },
    });
  }

  handleUpdatePassword(data: any) {
    this.isFullScreenLoading = true;
    this.cdr.markForCheck();

    this.authenticationService.changePassword(data).subscribe({
      next: () => {
        this.toastr.success('Đổi mật khẩu thành công. Vui lòng đăng nhập lại!');
        this.authStateService.clearUser();
        this.router.navigate(['/login']);
        this.serverErrors = null;
      },
      error: (error) => {
        console.error('Change password error:', error);
        this.serverErrors = error?.error || { message: 'Có lỗi xảy ra khi đổi mật khẩu!' };
        this.toastr.error(this.serverErrors.message || 'Có lỗi xảy ra khi đổi mật khẩu!');
      },
      complete: () => {
        this.isFullScreenLoading = false;
        this.openPopup = false;
        this.cdr.markForCheck();
      },
    });
  }
}

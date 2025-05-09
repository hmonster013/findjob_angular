import { ChangeDetectionStrategy, Component } from '@angular/core';
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
    AccountFormComponent
  ],
  templateUrl: './account-card.component.html',
  styleUrls: ['./account-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class AccountCardComponent {
  openPopup = false;
  isFullScreenLoading = false;
  serverErrors: any = null;

  constructor(
    private authenticationService: AuthenticationService,
    private authStateService: AuthStateService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  handleUpdateAccount(data: any) {
    this.isFullScreenLoading = true;
    this.authenticationService.updateUser(data).subscribe({
      next: () => {
        this.toastr.success('Cập nhật thông tin tài khoản thành công!');
        this.serverErrors = null;
      },
      error: (error) => {
        this.serverErrors = error?.error || { message: 'Có lỗi xảy ra!' };
        this.toastr.error(this.serverErrors.message || 'Có lỗi xảy ra!');
      },
      complete: () => {
        this.isFullScreenLoading = false;
      }
    });
  }

  handleUpdatePassword(data: any) {
    this.isFullScreenLoading = true;
    this.authenticationService.changePassword(data).subscribe({
      next: () => {
        this.toastr.success('Đổi mật khẩu thành công. Vui lòng đăng nhập lại!');
        this.authStateService.clearUser();
        this.router.navigate(['/login']);
        this.serverErrors = null;
      },
      error: (error) => {
        this.serverErrors = error?.error || { message: 'Có lỗi xảy ra khi đổi mật khẩu!' };
        this.toastr.error(this.serverErrors.message || 'Có lỗi xảy ra khi đổi mật khẩu!');
      },
      complete: () => {
        this.isFullScreenLoading = false;
        this.openPopup = false;
      }
    });
  }
}

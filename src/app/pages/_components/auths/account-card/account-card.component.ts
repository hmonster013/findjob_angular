import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../../../_services/authentication.service';
import { AuthStateService } from '../../../../_services/auth-state.service';
import { UpdatePasswordFormComponent } from "../update-password-form/update-password-form.component";
import { AvatarCardComponent } from "../avatar-card/avatar-card.component";
import { AccountFormComponent } from "../account-form/account-form.component";
@Component({
  selector: 'app-account-card',
  imports: [
    CommonModule,
    UpdatePasswordFormComponent,
    AvatarCardComponent,
    AccountFormComponent
],
  templateUrl: './account-card.component.html',
  styleUrl: './account-card.component.css'
})
export class AccountCardComponent {
  openPopup = false;
  isFullScreenLoading = false;
  serverErrors: any = {};

  constructor(
    private authenticationService: AuthenticationService,
    private authStateService: AuthStateService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  handleUpdateAccount(data: any) {
    this.authenticationService.updateUser(data).subscribe({
      next: () => {
        this.toastr.success('Cập nhật thông tin thành công!');
      },
      error: (error) => {
        this.serverErrors = error?.error || {};
        this.toastr.error('Có lỗi xảy ra!');
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
      },
      error: (error) => {
        this.serverErrors = error?.error || {};
        this.toastr.error('Có lỗi xảy ra khi đổi mật khẩu!');
      },
      complete: () => {
        this.isFullScreenLoading = false;
        this.openPopup = false;
      }
    });
  }
}

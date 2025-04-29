import { Component } from '@angular/core';
import { CompanyService } from '../../../../_services/company.service';
import { AuthStateService } from '../../../../_services/auth-state.service';
import { ToastrService } from 'ngx-toastr';
import { confirmModal } from '../../../../_utils/sweetalert2-modal';
import { AuthenticationService } from '../../../../_services/authentication.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar-card',
  imports: [
    CommonModule
  ],
  templateUrl: './avatar-card.component.html',
  styleUrl: './avatar-card.component.css'
})
export class AvatarCardComponent {
  isFullScreenLoading = false;
  currentUser: any;

  constructor(
    private authenticationService: AuthenticationService,
    private authStateService: AuthStateService,
    private toastr: ToastrService
  ) {
    this.currentUser = this.authStateService.getCurrentUser();
  }

  onSelectFile(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    this.isFullScreenLoading = true;
    this.authenticationService.updateAvatar(formData).subscribe({
      next: () => {
        this.toastr.success('Cập nhật ảnh đại diện thành công.');
      },
      error: () => {
        this.toastr.error('Đã xảy ra lỗi, vui lòng thử lại.');
      },
      complete: () => {
        this.isFullScreenLoading = false;
      }
    });
  }

  onDelete() {
    confirmModal(() => this.confirmDelete(), 'Xóa ảnh đại diện', 'Ảnh đại diện này sẽ được xóa và không thể khôi phục. Bạn có chắc chắn?', 'warning');
  }

  private confirmDelete() {
    this.isFullScreenLoading = true;
    this.authenticationService.deleteAvatar().subscribe({
      next: () => {
        this.toastr.success('Xóa ảnh đại diện thành công.');
      },
      error: () => {
        this.toastr.error('Đã xảy ra lỗi, vui lòng thử lại.');
      },
      complete: () => {
        this.isFullScreenLoading = false;
      }
    });
  }
}

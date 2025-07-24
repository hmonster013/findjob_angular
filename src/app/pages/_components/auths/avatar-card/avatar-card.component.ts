import { IMAGES } from './../../../../_configs/constants';
import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../../../_services/authentication.service';
import { AuthStateService } from '../../../../_services/auth-state.service';
import { ToastrService } from 'ngx-toastr';
import { confirmModal } from '../../../../_utils/sweetalert2-modal';
import { catchError, retry, timeout } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-avatar-card',
  imports: [CommonModule],
  templateUrl: './avatar-card.component.html',
  styleUrls: ['./avatar-card.component.css'],
  standalone: true,
})
export class AvatarCardComponent {
  isFullScreenLoading = false;
  currentUser: any;

  IMAGES = IMAGES;
  constructor(
    private authenticationService: AuthenticationService,
    private authStateService: AuthStateService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.currentUser = this.authStateService.getCurrentUser();
  }

  onSelectFile(event: any) {
    const file = event.target.files?.[0];
    if (!file) {
      this.toastr.error('Vui lòng chọn một file.');
      return;
    }

    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      this.toastr.error('Chỉ chấp nhận file PNG hoặc JPEG.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.toastr.error('Kích thước file không được vượt quá 5MB.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file); // File được gửi dưới dạng binary

    this.isFullScreenLoading = true;
    this.cdr.markForCheck();

    this.authenticationService.updateAvatar(formData).pipe(
      timeout(10000), // Timeout sau 10 giây
      retry(1), // Thử lại 1 lần nếu lỗi
      catchError((error) => {
        console.error('Update avatar error:', error);
        this.toastr.error(error?.error?.message || 'Cập nhật ảnh đại diện thất bại.');
        this.isFullScreenLoading = false;
        this.cdr.markForCheck();
        return throwError(() => error);
      })
    ).subscribe({
      next: (response) => {
        console.log('Update avatar response:', response);
        this.toastr.success('Cập nhật ảnh đại diện thành công.');

        // Cập nhật currentUser và localStorage
        if (response?.data?.avatarUrl) {
          this.currentUser = { ...this.currentUser, avatarUrl: response.data.avatarUrl };
          localStorage.setItem('current_user', JSON.stringify(this.currentUser));
          this.authStateService.setCurrentUser(this.currentUser);
        }
      },
      complete: () => {
        this.isFullScreenLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onDelete() {
    confirmModal(
      () => this.confirmDelete(),
      'Xóa ảnh đại diện',
      'Ảnh đại diện này sẽ được xóa và không thể khôi phục. Bạn có chắc chắn?',
      'warning'
    );
  }

  private confirmDelete() {
    this.isFullScreenLoading = true;
    this.cdr.markForCheck();

    this.authenticationService.deleteAvatar().pipe(
      timeout(10000),
      retry(1),
      catchError((error) => {
        console.error('Delete avatar error:', error);
        this.toastr.error(error?.error?.message || 'Xóa ảnh đại diện thất bại.');
        this.isFullScreenLoading = false;
        this.cdr.markForCheck();
        return throwError(() => error);
      })
    ).subscribe({
      next: (response) => {
        console.log('Delete avatar response:', response);
        this.toastr.success('Xóa ảnh đại diện thành công.');

        // Cập nhật currentUser và localStorage
        this.currentUser = { ...this.currentUser, avatarUrl: null };
        localStorage.setItem('current_user', JSON.stringify(this.currentUser));
        this.authStateService.setCurrentUser(this.currentUser);
      },
      complete: () => {
        this.isFullScreenLoading = false;
        this.cdr.markForCheck();
      },
    });
  }
}

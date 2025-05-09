import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { JobPostNotificationFormComponent } from '../job-post-notification-form/job-post-notification-form.component';
import { JobPostNotificationService } from '../../../../_services/job-post-notification.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-post-notification-card',
  standalone: true,
  templateUrl: './job-post-notification-card.component.html',
  styleUrls: ['./job-post-notification-card.component.css'],
  imports: [
    CommonModule,
    JobPostNotificationFormComponent,
    FormsModule // Thêm FormsModule để dùng ngModel
  ],
})
export class JobPostNotificationCardComponent implements OnInit {
  jobPostNotifications: any[] = [];
  isLoadingJobPostNotifications = true;
  isFullScreenLoading = false;
  openPopup = false;
  editData: any = null;
  page = 1;
  pageSize = 10;
  count = 0;

  // Giả sử allConfig được cung cấp (cần điều chỉnh nếu lấy từ service hoặc input)
  allConfig = {
    careerOptions: [
      { value: 8, label: 'Lập trình' }, // Ánh xạ career: 8
      // Thêm các option khác nếu có
    ],
    cityOptions: [
      { value: 1, label: 'Hà Nội' }, // Ánh xạ city: 1
      // Thêm các option khác nếu có
    ],
    frequencyNotificationOptions: [
      { id: 1, name: 'Hàng ngày' }, // Ánh xạ frequency: 1
      // Thêm các option khác nếu có
    ]
  };

  constructor(
    private jobPostNotificationService: JobPostNotificationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadJobPostNotifications();
  }

  loadJobPostNotifications() {
    this.isLoadingJobPostNotifications = true;
    const params = {
      page: this.page,
      pageSize: this.pageSize,
    };
    this.jobPostNotificationService.getJobPostNotifications(params).subscribe({
      next: (res) => {
        this.jobPostNotifications = res.data?.results || [];
        this.count = res.data?.count || 0;
      },
      error: (err) => {
        console.error('Error loading notifications:', err);
        this.toastr.error('Không thể tải danh sách thông báo!');
      },
      complete: () => {
        this.isLoadingJobPostNotifications = false;
      },
    });
  }

  handleShowAdd() {
    this.editData = null;
    this.openPopup = true;
  }

  handleShowUpdate(id: number) {
    this.isFullScreenLoading = true;
    this.jobPostNotificationService.getJobPostNotificationDetailById(id).subscribe({
      next: (res) => {
        this.editData = res.data;
        this.openPopup = true;
      },
      error: (err) => {
        console.error('Error loading notification:', err);
        this.toastr.error('Không thể tải thông tin thông báo!');
      },
      complete: () => {
        this.isFullScreenLoading = false;
      },
    });
  }

  handleAddOrUpdate = (data: any) => {
    this.isFullScreenLoading = true;
    if (data.id) {
      this.jobPostNotificationService.updateJobPostNotificationById(data.id, data).subscribe({
        next: () => {
          this.toastr.success('Cập nhật thông báo thành công!');
          this.loadJobPostNotifications();
          this.openPopup = false;
        },
        error: (err) => {
          console.error('Error updating notification:', err);
          this.toastr.error('Không thể cập nhật thông báo!');
        },
        complete: () => {
          this.isFullScreenLoading = false;
        },
      });
    } else {
      this.jobPostNotificationService.addJobPostNotification(data).subscribe({
        next: () => {
          this.toastr.success('Thêm thông báo thành công!');
          this.loadJobPostNotifications();
          this.openPopup = false;
        },
        error: (err) => {
          console.error('Error adding notification:', err);
          this.toastr.error('Không thể thêm thông báo!');
        },
        complete: () => {
          this.isFullScreenLoading = false;
        },
      });
    }
  };

  handleToggleActive(id: number, event: Event) {
    const isActive = (event.target as HTMLInputElement).checked;
    this.isFullScreenLoading = true;
    this.jobPostNotificationService.active(id).subscribe({
      next: () => {
        this.toastr.success(isActive ? 'Bật thông báo thành công!' : 'Tắt thông báo thành công!');
        this.loadJobPostNotifications();
      },
      error: (err) => {
        console.error('Error toggling notification:', err);
        this.toastr.error('Không thể thay đổi trạng thái thông báo!');
        // Hoàn nguyên trạng thái nếu lỗi
        this.jobPostNotifications = this.jobPostNotifications.map(notification =>
          notification.id === id ? { ...notification, isActive: !isActive } : notification
        );
      },
      complete: () => {
        this.isFullScreenLoading = false;
      },
    });
  }

  handleDelete(id: number) {
    Swal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc muốn xóa thông báo này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        this.jobPostNotificationService.deleteJobPostNotificationDetailById(id).subscribe({
          next: () => {
            this.toastr.success('Xóa thông báo thành công!');
            this.loadJobPostNotifications();
          },
          error: (err) => {
            console.error('Error deleting notification:', err);
            this.toastr.error('Không thể xóa thông báo!');
          },
        });
      }
    });
  }

  handleChangePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.loadJobPostNotifications();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.count / this.pageSize);
  }

  get pages(): number[] {
    const total = this.totalPages;
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(total, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Hàm ánh xạ ID sang tên
  getCareerName(careerId: number): string {
    const career = this.allConfig.careerOptions?.find((opt: any) => opt.value === careerId);
    return career ? career.label : 'Không xác định';
  }

  getCityName(cityId: number): string {
    const city = this.allConfig.cityOptions?.find((opt: any) => opt.value === cityId);
    return city ? city.label : 'Không xác định';
  }

  getFrequencyName(frequencyId: number): string {
    const frequency = this.allConfig.frequencyNotificationOptions?.find((opt: any) => opt.id === frequencyId);
    return frequency ? frequency.name : 'Không xác định';
  }
}

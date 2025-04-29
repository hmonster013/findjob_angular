import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { JobPostNotificationFormComponent } from '../job-post-notification-form/job-post-notification-form.component';
import { JobPostNotificationService } from '../../../../_services/job-post-notification.service';

@Component({
  selector: 'app-job-post-notification-card',
  standalone: true,
  templateUrl: './job-post-notification-card.component.html',
  styleUrls: ['./job-post-notification-card.component.css'],
  imports: [
    CommonModule,
    JobPostNotificationFormComponent
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
        },
        complete: () => {
          this.isFullScreenLoading = false;
        },
      });
    }
  };

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
          },
        });
      }
    });
  }

  handleChangePage(newPage: number) {
    this.page = newPage;
    this.loadJobPostNotifications();
  }

  get totalPages(): number {
    return Math.ceil(this.count / this.pageSize);
  }
}

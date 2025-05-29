import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplyFormComponent } from '../apply-form/apply-form.component';
import { JobPostActivityService } from '../../_services/job-post-activity.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-apply-card',
  standalone: true,
  imports: [CommonModule, ApplyFormComponent],
  templateUrl: './apply-card.component.html',
})
export class ApplyCardComponent {
  @Input() jobPostId!: number;
  @Input() jobPost!: any;
  @Input() openPopup = false;
  @Input() isApplied = false; // Thêm Input để nhận trạng thái ứng tuyển

  @Output() setOpenPopup = new EventEmitter<boolean>();
  @Output() applySuccess = new EventEmitter<boolean>();

  isFullScreenLoading = false;

  constructor(
    private jobPostActivityService: JobPostActivityService,
    private toastr: ToastrService
  ) {}

  handleApplyJob(data: any) {
    this.isFullScreenLoading = true;
    this.jobPostActivityService.applyJob({ ...data, job_post: this.jobPostId }).subscribe({
      next: () => {
        this.toastr.success('Ứng tuyển thành công.');
        this.applySuccess.emit(true);
        this.setOpenPopup.emit(false);
        this.isFullScreenLoading = false;
      },
      error: (err) => {
        this.toastr.error('Ứng tuyển thất bại. Vui lòng thử lại!');
        console.error(err);
        this.isFullScreenLoading = false;
      },
    });
  }
}

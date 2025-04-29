import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplyFormComponent } from '../apply-form/apply-form.component';
import { JobPostActivityService } from '../../_services/job-post-activity.service';

@Component({
  selector: 'app-apply-card',
  standalone: true,
  imports: [
    CommonModule,
    ApplyFormComponent
  ],
  templateUrl: './apply-card.component.html',
})
export class ApplyCardComponent {
  @Input() jobPost: any;

  openPopup = false;
  isFullScreenLoading = false;

  constructor(private jobPostActivityService: JobPostActivityService) {}

  get popupTitle(): string {
    return `Ứng tuyển vị trí ${this.jobPost?.title || ''}`;
  }

  setOpenPopup(state: boolean) {
    this.openPopup = state;
  }

  handleApplyJob(data: any) {
    this.isFullScreenLoading = true;
    const payload = {
      ...data,
      job_post: this.jobPost?.id,
    };

    this.jobPostActivityService.applyJob(payload).subscribe({
      next: () => {
        alert('Ứng tuyển thành công.');
        this.openPopup = false;
      },
      error: () => {
        alert('Ứng tuyển thất bại.');
      },
      complete: () => {
        this.isFullScreenLoading = false;
      },
    });
  }
}

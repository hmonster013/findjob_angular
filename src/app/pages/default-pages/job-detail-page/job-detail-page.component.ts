import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterJobPostCardComponent } from '../../_components/defaults/filter-job-post-card/filter-job-post-card.component';
import { SocialNetworkSharingPopupComponent } from '../../../_components/social-network-sharing-popup/social-network-sharing-popup.component';
import { ApplyCardComponent } from '../../../_components/apply-card/apply-card.component';
import { MuiImageCustomComponent } from '../../../_components/mui-image-custom/mui-image-custom.component';
import { AuthStateService } from '../../../_services/auth-state.service';
import { ROLES_NAME } from '../../../_configs/constants';
import { JobService } from '../../../_services/job.service';
// TODO: Bạn cần tự tạo 3 component này nếu chưa có
// import { QrCodeComponent } from '@/components/qr-code.component';
// import { MapComponent } from '@/components/map.component';
// import { LoadingButtonComponent } from '@/components/loading-button.component';

@Component({
  selector: 'app-job-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    FilterJobPostCardComponent,
    SocialNetworkSharingPopupComponent,
    ApplyCardComponent,
    MuiImageCustomComponent,
    // QrCodeComponent,
    // MapComponent,
    // LoadingButtonComponent,
  ],
  templateUrl: './job-detail-page.component.html',
})
export class JobDetailPageComponent implements OnInit {
  slug = '';
  isLoading = true;
  isLoadingSave = false;
  openSharePopup = false;

  jobPost: any = null;
  isAuthenticated = false;
  currentUser: any;

  constructor(
    private route: ActivatedRoute,
    private jobService: JobService,
    private authService: AuthStateService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    this.isAuthenticated = this.authService.isAuthenticated();
    this.currentUser = this.authService.getCurrentUser();

    this.jobService.getJobPostDetailById(this.slug).subscribe({
      next: (res) => {
        this.jobPost = res.data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  handleSaveJobPost() {
    this.isLoadingSave = true;
    this.jobService.saveJobPost(this.slug).subscribe({
      next: (res) => {
        const isSaved = res.data.isSaved;
        const current = this.jobPost;
        this.jobPost = {
          ...current,
          isSaved,
          saveNumber: isSaved ? current.saveNumber + 1 : current.saveNumber - 1,
        };
        alert(isSaved ? 'Đã lưu tin' : 'Đã hủy lưu tin');
        this.isLoadingSave = false;
      },
      error: () => {
        alert('Có lỗi xảy ra');
        this.isLoadingSave = false;
      },
    });
  }

  get isJobSeeker(): boolean {
    return this.isAuthenticated && this.currentUser?.roleName === ROLES_NAME.JOB_SEEKER;
  }

  get currentUrl(): string {
    return window.location.href;
  }
}

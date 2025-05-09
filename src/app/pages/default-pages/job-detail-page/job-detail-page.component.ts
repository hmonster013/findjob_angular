import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { SocialNetworkSharingPopupComponent } from '../../../_components/social-network-sharing-popup/social-network-sharing-popup.component';
import { ApplyCardComponent } from '../../../_components/apply-card/apply-card.component';
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
    SocialNetworkSharingPopupComponent,
    ApplyCardComponent,
    // QrCodeComponent,
    // MapComponent,
    // LoadingButtonComponent,
  ],
  templateUrl: './job-detail-page.component.html',
  styleUrls: ['./job-detail-page.component.css'],
})
export class JobDetailPageComponent implements OnInit {
  slug = '';
  isLoading = true;
  isLoadingSave = false;
  openSharePopup = false;
  openPopup = false;
  isApplySuccess = false;

  jobPost: any = null;
  isAuthenticated = false;
  currentUser: any;

  // Ánh xạ các giá trị số thành text
  positionMap: { [key: number]: string } = {
    9: 'Nhân viên' // Ví dụ, dựa trên jobPost.position = 9
  };

  jobTypeMap: { [key: number]: string } = {
    3: 'Toàn thời gian' // Ví dụ, dựa trên jobPost.jobType = 3
  };

  genderMap: { [key: string]: string } = {
    'M': 'Nam',
    'F': 'Nữ',
    'O': 'Không yêu cầu'
  };

  constructor(
    private route: ActivatedRoute,
    private jobService: JobService,
    private authService: AuthStateService,
    private toastr: ToastrService
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
        this.toastr.success(isSaved ? 'Đã lưu tin' : 'Đã hủy lưu tin');
        this.isLoadingSave = false;
      },
      error: () => {
        this.toastr.error('Có lỗi xảy ra');
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

  formatSalary(min: number, max: number): string {
    if (!min && !max) return 'Thoả thuận';
    if (min && max) {
      return `${(min / 1000000).toFixed(1)} - ${(max / 1000000).toFixed(1)} triệu`;
    }
    if (min) return `Từ ${(min / 1000000).toFixed(1)} triệu`;
    return `Lên đến ${(max / 1000000).toFixed(1)} triệu`;
  }
}

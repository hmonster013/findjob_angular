import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { SocialNetworkSharingPopupComponent } from '../../../_components/social-network-sharing-popup/social-network-sharing-popup.component';
import { ApplyCardComponent } from '../../../_components/apply-card/apply-card.component';
import { AuthStateService } from '../../../_services/auth-state.service';
import { ROLES_NAME } from '../../../_configs/constants';
import { JobService } from '../../../_services/job.service';
import { FilterJobPostCardComponent } from "../../_components/defaults/filter-job-post-card/filter-job-post-card.component";

@Component({
  selector: 'app-job-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    SocialNetworkSharingPopupComponent,
    ApplyCardComponent,
    FilterJobPostCardComponent
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
    if (!min && !max) return 'Thỏa thuận';

    const formatNumber = (num: number): string => {
      const million = num / 1_000_000;
      return million % 1 === 0 ? million.toString() : million.toFixed(2);
    };

    if (min && max) {
      return `${formatNumber(min)} - ${formatNumber(max)} tr`;
    }
    if (min) {
      return `Từ ${formatNumber(min)} tr`;
    }
    return `Đến ${formatNumber(max!)} tr`;
  }
}

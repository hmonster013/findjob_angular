import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { SocialNetworkSharingPopupComponent } from '../../../_components/social-network-sharing-popup/social-network-sharing-popup.component';
import { ApplyCardComponent } from '../../../_components/apply-card/apply-card.component';
import { AuthStateService } from '../../../_services/auth-state.service';
import { ROLES_NAME } from '../../../_configs/constants';
import { JobService } from '../../../_services/job.service';
import { FilterJobPostCardComponent } from '../../_components/defaults/filter-job-post-card/filter-job-post-card.component';
import { CommonService } from '../../../_services/common.service';

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
  styleUrls: ['./job-detail-page.component.css']
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

  genderDict: { [key: string]: string } | null = null;
  positionDict: { [key: string]: string } | null = null;
  jobTypeDict: { [key: string]: string } | null = null;
  experienceDict: { [key: string]: string } | null = null;

  constructor(
    private route: ActivatedRoute,
    private jobService: JobService,
    private authService: AuthStateService,
    private commonService: CommonService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    this.isAuthenticated = this.authService.isAuthenticated();
    this.currentUser = this.authService.getCurrentUser();

    this.getConfigs();
    this.getJobPostDetailById();
  }

  getConfigs() {
    this.commonService.getConfigs().subscribe({
      next: (res) => {
        const data = res.data;
        this.genderDict = data.genderDict;
        this.positionDict = data.positionDict;
        this.jobTypeDict = data.jobTypeDict;
        this.experienceDict = data.experienceDict;
      },
      error: () => {
        this.toastr.error('Không thể tải cấu hình');
      }
    });
  }

  getJobPostDetailById() {
    this.jobService.getJobPostDetailById(this.slug).subscribe({
      next: (res) => {
        this.jobPost = res.data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastr.error('Không thể tải chi tiết công việc');
      }
    });
  }

  handleApplySuccess() {
    this.isApplySuccess = true;
    this.jobPost = {
      ...this.jobPost,
      isApplied: true
    };

    this.jobService.getJobPostDetailById(this.slug).subscribe({
      next: (res) => {
        this.jobPost = res.data;
      },
      error: () => {
        this.toastr.error('Không thể cập nhật trạng thái ứng tuyển');
      }
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
          saveNumber: isSaved ? current.saveNumber + 1 : current.saveNumber - 1
        };
        this.toastr.success(isSaved ? 'Đã lưu tin' : 'Đã hủy lưu tin');
        this.isLoadingSave = false;
      },
      error: () => {
        this.toastr.error('Có lỗi xảy ra');
        this.isLoadingSave = false;
      }
    });
  }

  get isJobSeeker(): boolean {
    return this.isAuthenticated && this.currentUser?.roleName === ROLES_NAME.JOB_SEEKER;
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

  getPositionName(positionId: number): string {
    return this.positionDict?.[positionId] || 'Chưa cập nhật';
  }

  getJobTypeName(jobTypeId: number): string {
    return this.jobTypeDict?.[jobTypeId] || 'Chưa cập nhật';
  }

  getGenderName(genderId: string): string {
    return this.genderDict?.[genderId] || 'Chưa cập nhật';
  }
}

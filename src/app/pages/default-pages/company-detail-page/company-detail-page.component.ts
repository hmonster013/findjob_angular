import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FilterJobPostCardComponent } from '../../_components/defaults/filter-job-post-card/filter-job-post-card.component';
import { NoDataCardComponent } from '../../../_components/no-data-card/no-data-card.component';
import { ImageGalleryCustomComponent } from '../../../_components/image-gallery-custom/image-gallery-custom.component';
import { SocialNetworkSharingPopupComponent } from '../../../_components/social-network-sharing-popup/social-network-sharing-popup.component';
import { CompanyService } from '../../../_services/company.service';
import { AuthStateService } from '../../../_services/auth-state.service';
import { IMAGES, ROLES_NAME } from '../../../_configs/constants';
import { ToastrService } from 'ngx-toastr'; // Thêm Toastr

@Component({
  selector: 'app-company-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    // QRCodeModule,
    FilterJobPostCardComponent,
    NoDataCardComponent,
    // MapComponent,
    ImageGalleryCustomComponent,
    SocialNetworkSharingPopupComponent,
    // LoadingButtonComponent,
  ],
  templateUrl: './company-detail-page.component.html',
})
export class CompanyDetailPageComponent implements OnInit {
  slug = '';
  isAuthenticated = false;
  currentUser: any;
  isLoading = true;
  isLoadingFollow = false;
  companyDetail: any = null;
  imageList: any[] = [];
  openSharePopup = false;

  IMAGES = IMAGES;

  // Dictionary để ánh xạ employeeSize
  employeeSizeDict: { [key: number]: string } = {
    1: 'Dưới 10 nhân viên',
    2: '10 - 150 nhân viên',
    3: '150 - 300 nhân viên',
    4: 'Trên 300 nhân viên',
  };

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private authService: AuthStateService,
    private toastr: ToastrService // Thêm Toastr
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    this.isAuthenticated = this.authService.isAuthenticated();
    this.currentUser = this.authService.getCurrentUser();

    this.getCompanyDetailData();
  }

  getCompanyDetailData() {
    this.companyService.getCompanyDetailById(this.slug).subscribe({
      next: (res) => {
        this.companyDetail = res.data;
        this.imageList = (res.data?.companyImages || []).map((img: any) => ({
          original: img.imageUrl,
          thumbnail: img.imageUrl,
        }));
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Không tải được dữ liệu công ty');
        this.isLoading = false;
      },
    });
  }

  handleFollow(): void {
    if (this.isLoadingFollow) return; // Ngăn gọi API khi đang loading

    this.isLoadingFollow = true;
    this.companyService.followCompany(this.slug).subscribe({
      next: (res) => {
        const isFollowed = res.data.isFollowed;
        const current = this.companyDetail;
        this.companyDetail = {
          ...current,
          isFollowed,
          followNumber: isFollowed
            ? current.followNumber + 1
            : current.followNumber - 1,
        };
        this.toastr.success(
          isFollowed ? 'Theo dõi thành công' : 'Hủy theo dõi thành công'
        );
        this.isLoadingFollow = false;
      },
      error: () => {
        this.toastr.error('Có lỗi xảy ra khi theo dõi');
        this.isLoadingFollow = false;
      },
    });
  }

  get isJobSeeker(): boolean {
    return this.isAuthenticated && this.currentUser?.roleName === ROLES_NAME.JOB_SEEKER;
  }

  get website(): string {
    return this.companyDetail?.websiteUrl || '';
  }

  get location(): string {
    return this.companyDetail?.location?.address || 'Chưa cập nhật';
  }

  get currentUrl(): string {
    return window.location.href;
  }

  get employeeSizeDisplay(): string {
    return this.companyDetail?.employeeSize
      ? this.employeeSizeDict[this.companyDetail.employeeSize] || 'Chưa cập nhật'
      : 'Chưa cập nhật';
  }

  get sinceDisplay(): string {
    return this.companyDetail?.since
      ? new Date(this.companyDetail.since).toLocaleDateString('vi-VN')
      : 'Chưa cập nhật';
  }
}

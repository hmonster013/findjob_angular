import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MuiImageCustomComponent } from '../../../_components/mui-image-custom/mui-image-custom.component';
import { FilterJobPostCardComponent } from '../../_components/defaults/filter-job-post-card/filter-job-post-card.component';
import { NoDataCardComponent } from '../../../_components/no-data-card/no-data-card.component';
import { ImageGalleryCustomComponent } from '../../../_components/image-gallery-custom/image-gallery-custom.component';
import { SocialNetworkSharingPopupComponent } from '../../../_components/social-network-sharing-popup/social-network-sharing-popup.component';
import { CompanyService } from '../../../_services/company.service';
import { AuthStateService } from '../../../_services/auth-state.service';
import { IMAGES, ROLES_NAME } from '../../../_configs/constants';

// TODO: Bạn cần tạo QrCodeComponent thay cho QRCodeModule
// import { QrCodeComponent } from '@/components/qr-code.component';
// TODO: Bạn cần tạo MapComponent (bản đồ) như bên React
// import { MapComponent } from '@/components/map.component';
// TODO: Bạn cần tạo LoadingButtonComponent thay LoadingButton bên MUI
// import { LoadingButtonComponent } from '@/components/loading-button.component';

@Component({
  selector: 'app-company-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    // QRCodeModule,
    MuiImageCustomComponent,
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
  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private authService: AuthStateService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    this.isAuthenticated = this.authService.isAuthenticated();
    this.currentUser = this.authService.getCurrentUser();

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
        this.isLoading = false;
      },
    });
  }

  handleFollow(): void {
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
        alert(isFollowed ? 'Theo dõi thành công.' : 'Hủy theo dõi thành công.');
        this.isLoadingFollow = false;
      },
      error: () => {
        alert('Có lỗi xảy ra');
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
}

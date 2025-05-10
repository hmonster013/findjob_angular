import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from '../../../../_services/company.service';
import { BackdropLoadingComponent } from '../../../../_components/backdrop-loading/backdrop-loading.component';
import { CompanyFormComponent } from '../company-form/company-form.component';

@Component({
  selector: 'app-company-card',
  standalone: true,
  imports: [
    CommonModule,
    BackdropLoadingComponent,
    CompanyFormComponent
  ],
  templateUrl: './company-card.component.html',
  styleUrls: ['./company-card.component.css']
})
export class CompanyCardComponent implements OnInit {
  isLoadingCompany = true;
  isFullScreenLoading = false;
  editData: any = null;
  companyImageUrl: string | null = null;
  companyCoverImageUrl: string | null = null;
  serverErrors: any = null;

  constructor(
    private companyService: CompanyService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCompany();
  }

  loadCompany(): void {
    this.isLoadingCompany = true;
    this.companyService.getCompany().subscribe({
      next: (res) => {
        const data = res.data || {};
        this.editData = {
          ...data,
          description: data.description || '',
          location: {
            city: data.location?.city || '',
            district: data.location?.district || '',
            address: data.location?.address || '',
            latitude: data.location?.lat || '',
            longitude: data.location?.lng || ''
          },
          locationDict: data.locationDict || { city: '' },
          mobileUserDict: data.mobileUserDict || { id: '', fullName: '', email: '' },
          companyImages: data.companyImages || []
        };
        this.companyImageUrl = data.companyImageUrl || null;
        this.companyCoverImageUrl = data.companyCoverImageUrl || null;
        this.isLoadingCompany = false;
      },
      error: (err) => {
        this.toastrService.error('Không thể tải thông tin công ty', 'Lỗi');
        this.isLoadingCompany = false;
      }
    });
  }

  handleUpdate(data: any): void {
    this.isFullScreenLoading = true;
    const updateData = {
      companyName: data.companyName,
      taxCode: data.taxCode,
      employeeSize: data.employeeSize,
      fieldOperation: data.fieldOperation,
      since: data.since,
      websiteUrl: data.websiteUrl,
      facebookUrl: data.facebookUrl,
      youtubeUrl: data.youtubeUrl,
      linkedinUrl: data.linkedinUrl,
      companyEmail: data.companyEmail,
      companyPhone: data.companyPhone,
      location: data.location,
      description: data.description,
      locationDict: data.locationDict,
      mobileUserDict: data.mobileUserDict,
      companyImages: data.companyImages
    };

    this.companyService.updateCompany(data.id, updateData).subscribe({
      next: () => {
        this.toastrService.success('Cập nhật thông tin công ty thành công');
        this.loadCompany();
        this.serverErrors = null;
        this.isFullScreenLoading = false;
      },
      error: (err) => {
        this.serverErrors = err.error || null;
        this.toastrService.error('Không thể cập nhật thông tin công ty', 'Lỗi');
        this.isFullScreenLoading = false;
      }
    });
  }

  handleUploadLogo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      this.toastrService.error('Chỉ hỗ trợ file .jpg hoặc .png', 'Lỗi');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.toastrService.error('Kích thước file tối đa là 2MB', 'Lỗi');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.isFullScreenLoading = true;
    this.companyService.updateCompanyImageUrl(formData).subscribe({
      next: (res) => {
        this.companyImageUrl = res.data?.companyImageUrl || null;
        this.toastrService.success('Cập nhật logo công ty thành công');
        this.isFullScreenLoading = false;
        input.value = ''; // Reset input
      },
      error: (err) => {
        this.toastrService.error('Không thể cập nhật logo', 'Lỗi');
        console.error('Upload logo error:', err);
        this.isFullScreenLoading = false;
      }
    });
  }

  handleUploadCover(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      this.toastrService.error('Chỉ hỗ trợ file .jpg hoặc .png', 'Lỗi');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.toastrService.error('Kích thước file tối đa là 5MB', 'Lỗi');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.isFullScreenLoading = true;
    this.companyService.updateCompanyCoverImageUrl(formData).subscribe({
      next: (res) => {
        this.companyCoverImageUrl = res.data?.companyCoverImageUrl || null;
        this.toastrService.success('Cập nhật ảnh bìa công ty thành công');
        this.isFullScreenLoading = false;
        input.value = ''; // Reset input
      },
      error: (err) => {
        this.toastrService.error('Không thể cập nhật ảnh bìa', 'Lỗi');
        console.error('Upload cover error:', err);
        this.isFullScreenLoading = false;
      }
    });
  }
}

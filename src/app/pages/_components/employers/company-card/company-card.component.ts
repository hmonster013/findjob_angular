import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from '../../../../_services/company.service';
import { BackdropLoadingComponent } from '../../../../_components/backdrop-loading/backdrop-loading.component';
import { CompanyFormComponent } from '../company-form/company-form.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-company-card',
  standalone: true,
  imports: [
    CommonModule,
    BackdropLoadingComponent,
    CompanyFormComponent
  ],
  templateUrl: './company-card.component.html',
  styleUrls: ['./company-card.component.css'],
  providers: [DatePipe]
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
    private toastrService: ToastrService,
    private datePipe: DatePipe
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
          id: data.id,
          companyName: data.companyName || '',
          taxCode: data.taxCode || '',
          employeeSize: data.employeeSize || '',
          fieldOperation: data.fieldOperation || '',
          since: data.since || '',
          websiteUrl: data.websiteUrl || '',
          facebookUrl: data.facebookUrl || '',
          youtubeUrl: data.youtubeUrl || '',
          linkedinUrl: data.linkedinUrl || '',
          companyEmail: data.companyEmail || '',
          companyPhone: data.companyPhone || '',
          location: {
            city: data.location?.city || '',
            district: data.location?.district || '',
            address: data.location?.address || '',
            latitude: data.location?.lat || '',
            longitude: data.location?.lng || ''
          },
          description: data.description || '',
          locationDict: data.locationDict || { city: '' },
          mobileUserDict: data.mobileUserDict || { id: '', fullName: '', email: '' },
          companyImages: data.companyImages || []
        };
        this.companyImageUrl = data.companyImageUrl || null;
        this.companyCoverImageUrl = data.companyCoverImageUrl || null;
        this.isLoadingCompany = false;
      },
      error: () => {
        Swal.fire({
          title: 'Lỗi',
          text: 'Không thể tải thông tin công ty',
          icon: 'error',
          confirmButtonText: 'Đóng',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700'
          }
        });
        this.isLoadingCompany = false;
      }
    });
  }

  handleUpdate(data: any): void {
    this.isFullScreenLoading = true;
    const updateData = {
      id: data.id,
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
      location: {
        city: data.location.city,
        district: data.location.district,
        address: data.location.address,
        lat: data.location.latitude,
        lng: data.location.longitude
      },
      description: data.description,
      locationDict: data.locationDict,
      mobileUserDict: data.mobileUserDict,
      companyImages: data.companyImages
    };

    this.companyService.updateCompany(data.id, updateData).subscribe({
      next: () => {
        Swal.fire({
          title: 'Thành công',
          text: 'Cập nhật thông tin công ty thành công',
          icon: 'success',
          confirmButtonText: 'Đóng',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700'
          }
        });
        this.loadCompany();
        this.serverErrors = null;
        this.isFullScreenLoading = false;
      },
      error: (err) => {
        this.serverErrors = err.error || null;
        Swal.fire({
          title: 'Lỗi',
          text: 'Không thể cập nhật thông tin công ty',
          icon: 'error',
          confirmButtonText: 'Đóng',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700'
          }
        });
        this.isFullScreenLoading = false;
      }
    });
  }

  handleUploadLogo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      Swal.fire({
        title: 'Lỗi',
        text: 'Chỉ hỗ trợ file .jpg hoặc .png',
        icon: 'error',
        confirmButtonText: 'Đóng',
        buttonsStyling: false,
        customClass: {
          confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700'
        }
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        title: 'Lỗi',
        text: 'Kích thước file tối đa là 2MB',
        icon: 'error',
        confirmButtonText: 'Đóng',
        buttonsStyling: false,
        customClass: {
          confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700'
        }
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.isFullScreenLoading = true;
    this.companyService.updateCompanyImageUrl(formData).subscribe({
      next: (res) => {
        this.companyImageUrl = res.data?.companyImageUrl || null;
        Swal.fire({
          title: 'Thành công',
          text: 'Cập nhật logo công ty thành công',
          icon: 'success',
          confirmButtonText: 'Đóng',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700'
          }
        });
        this.isFullScreenLoading = false;
        input.value = ''; // Reset input
      },
      error: () => {
        Swal.fire({
          title: 'Lỗi',
          text: 'Không thể cập nhật logo',
          icon: 'error',
          confirmButtonText: 'Đóng',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700'
          }
        });
        this.isFullScreenLoading = false;
      }
    });
  }

  handleUploadCover(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      Swal.fire({
        title: 'Lỗi',
        text: 'Chỉ hỗ trợ file .jpg hoặc .png',
        icon: 'error',
        confirmButtonText: 'Đóng',
        buttonsStyling: false,
        customClass: {
          confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700'
        }
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: 'Lỗi',
        text: 'Kích thước file tối đa là 5MB',
        icon: 'error',
        confirmButtonText: 'Đóng',
        buttonsStyling: false,
        customClass: {
          confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700'
        }
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.isFullScreenLoading = true;
    this.companyService.updateCompanyCoverImageUrl(formData).subscribe({
      next: (res) => {
        this.companyCoverImageUrl = res.data?.companyCoverImageUrl || null;
        Swal.fire({
          title: 'Thành công',
          text: 'Cập nhật ảnh bìa công ty thành công',
          icon: 'success',
          confirmButtonText: 'Đóng',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700'
          }
        });
        this.isFullScreenLoading = false;
        input.value = ''; // Reset input
      },
      error: () => {
        Swal.fire({
          title: 'Lỗi',
          text: 'Không thể cập nhật ảnh bìa',
          icon: 'error',
          confirmButtonText: 'Đóng',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700'
          }
        });
        this.isFullScreenLoading = false;
      }
    });
  }
}

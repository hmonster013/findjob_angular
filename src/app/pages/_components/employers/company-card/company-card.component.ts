import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from '../../../../_services/company.service';
import { CompanyFormComponent } from '../company-form/company-form.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-company-card',
  standalone: true,
  imports: [
    CommonModule,
    CompanyFormComponent
  ],
  templateUrl: './company-card.component.html',
  styleUrls: ['./company-card.component.css'],
  providers: [DatePipe]
})
export class CompanyCardComponent implements OnInit {
  isLoadingCompany = true;
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
          employeeSize: data.employeeSize ? data.employeeSize.toString() : '',
          fieldOperation: data.fieldOperation || '',
          since: data.since || '',
          websiteUrl: data.websiteUrl || '',
          facebookUrl: data.facebookUrl || '',
          youtubeUrl: data.youtubeUrl || '',
          linkedinUrl: data.linkedinUrl || '',
          companyEmail: data.companyEmail || '',
          companyPhone: data.companyPhone || '',
          location: {
            city: data.location?.city ? data.location.city.toString() : '',
            district: data.location?.district ? data.location.district.toString() : '',
            address: data.location?.address || '',
            lat: data.location?.lat ? data.location.lat.toString() : '',
            lng: data.location?.lng ? data.location.lng.toString() : ''
          },
          description: data.description || ''
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
    const updateData = {
      id: data.id,
      companyName: data.companyName,
      taxCode: data.taxCode || null,
      employeeSize: Number(data.employeeSize),
      fieldOperation: data.fieldOperation,
      since: data.since || null,
      websiteUrl: data.websiteUrl || null,
      facebookUrl: data.facebookUrl || null,
      youtubeUrl: data.youtubeUrl || null,
      linkedinUrl: data.linkedinUrl || null,
      companyEmail: data.companyEmail,
      companyPhone: data.companyPhone,
      location: {
        city: Number(data.location.city),
        district: data.location.district ? Number(data.location.district) : null,
        address: data.location.address,
        lat: data.location.lat ? Number(data.location.lat) : null,
        lng: data.location.lng ? Number(data.location.lng) : null
      },
      description: data.description
    };

    console.log('Update data:', updateData);

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
      },
      error: (err) => {
        console.error('Update error:', err);
        this.serverErrors = err.error?.errors || err.error || null;
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
        input.value = '';
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
        input.value = '';
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
      }
    });
  }
}

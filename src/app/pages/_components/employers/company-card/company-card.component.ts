import { ToastrService } from 'ngx-toastr';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../../../_services/company.service';
import { BackdropLoadingComponent } from '../../../../_components/backdrop-loading/backdrop-loading.component';
import { CompanyFormComponent } from '../company-form/company-form.component';
import { confirmModal, errorModal } from '../../../../_utils/sweetalert2-modal';
@Component({
  selector: 'app-company-card',
  imports: [
    CommonModule,
    BackdropLoadingComponent,
    CompanyFormComponent
  ],
  templateUrl: './company-card.component.html',
  styleUrl: './company-card.component.css'
})
export class CompanyCardComponent {
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

  loadCompany() {
    this.isLoadingCompany = true;
    this.companyService.getCompany().subscribe({
      next: (res) => {
        const data = res.data;
        this.editData = {
          ...data,
          description: data?.description || '',
        };
        this.companyImageUrl = data?.companyImageUrl;
        this.companyCoverImageUrl = data?.companyCoverImageUrl;
        this.isLoadingCompany = false;
      },
      error: (err) => {
        errorModal('Lỗi', 'Không thể tải thông tin công ty');
        this.isLoadingCompany = false;
      }
    });
  }

  handleUpdate(data: any) {
    this.isFullScreenLoading = true;

    this.companyService.updateCompany(data.id, {
      ...data,
      description: data.description,
    }).subscribe({
      next: () => {
        this.toastrService.success('Cập nhật thông tin công ty thành công.');
        this.loadCompany();
        this.serverErrors = null;
        this.isFullScreenLoading = false;
      },
      error: (err) => {
        this.serverErrors = err.error || null;
        errorModal('Lỗi', 'Không thể cập nhật thông tin công ty');
        this.isFullScreenLoading = false;
      }
    });
  }

  handleUploadLogo(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    this.isFullScreenLoading = true;
    this.companyService.updateCompanyImageUrl(formData).subscribe({
      next: (res) => {
        this.companyImageUrl = res.data?.companyImageUrl || null;
        this.toastrService.success('Cập nhật logo công ty thành công.');
        this.isFullScreenLoading = false;
      },
      error: () => {
        errorModal('Lỗi', 'Không thể cập nhật logo');
        this.isFullScreenLoading = false;
      }
    });
  }

  handleUploadCover(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    this.isFullScreenLoading = true;
    this.companyService.updateCompanyCoverImageUrl(formData).subscribe({
      next: (res) => {
        this.companyCoverImageUrl = res.data?.companyCoverImageUrl || null;
        this.toastrService.success('Cập nhật ảnh bìa công ty thành công.');
        this.isFullScreenLoading = false;
      },
      error: () => {
        errorModal('Lỗi', 'Không thể cập nhật ảnh bìa');
        this.isFullScreenLoading = false;
      }
    });
  }
}

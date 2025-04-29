import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyImageService } from '../../../../_services/company-image.service';
import { BackdropLoadingComponent } from '../../../../_components/backdrop-loading/backdrop-loading.component';
import { confirmModal, errorModal } from '../../../../_utils/sweetalert2-modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-company-image-card',
  imports: [
    CommonModule,
    BackdropLoadingComponent,
  ],
  templateUrl: './company-image-card.component.html',
  styleUrl: './company-image-card.component.css'
})
export class CompanyImageCardComponent {
  isLoading: boolean = false;
  isFullScreenLoading: boolean = false;
  fileList: any[] = [];
  previewImage: string = '';
  previewVisible: boolean = false;

  constructor(
    private companyImageService: CompanyImageService,
    private toastrMessages: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchImages();
  }

  fetchImages() {
    this.isFullScreenLoading = true;
    this.companyImageService.getCompanyImages().subscribe({
      next: (res) => {
        const results = res.data?.results || [];
        this.fileList = results.map((item: any) => ({
          uid: item.id,
          url: item.imageUrl
        }));
        this.isFullScreenLoading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.isFullScreenLoading = false;
      }
    });
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (!files.length) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    this.uploadFiles(formData);
  }

  uploadFiles(formData: FormData) {
    this.isFullScreenLoading = true;
    this.companyImageService.addCompanyImage(formData).subscribe({
      next: (res) => {
        const results = res.data || [];
        const newImages = results.map((item: any) => ({
          uid: item.id,
          url: item.imageUrl
        }));
        this.fileList = [...this.fileList, ...newImages];
        this.toastrMessages.success('Tải ảnh lên thành công.');
        this.isFullScreenLoading = false;
      },
      error: (err) => {
        errorModal('Lỗi', 'Không thể tải ảnh lên');
        this.isFullScreenLoading = false;
      }
    });
  }

  onDeleteImage(image: any) {
    confirmModal(() => {
      this.isFullScreenLoading = true;
      this.companyImageService.deleteCompanyImage(image.uid).subscribe({
        next: () => {
          this.fileList = this.fileList.filter(item => item.uid !== image.uid);
          this.toastrMessages.success('Xóa ảnh thành công.');
          this.isFullScreenLoading = false;
        },
        error: () => {
          errorModal('Lỗi', 'Không thể xóa ảnh');
          this.isFullScreenLoading = false;
        }
      });
    }, 'Xóa hình ảnh', 'Bạn có chắc chắn muốn xóa ảnh này?', 'warning');
  }

  onPreviewImage(image: any) {
    this.previewImage = image.url;
    this.previewVisible = true;
  }
}

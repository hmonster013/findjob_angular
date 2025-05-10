import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyImageService } from '../../../../_services/company-image.service';
import { BackdropLoadingComponent } from '../../../../_components/backdrop-loading/backdrop-loading.component';
import { confirmModal, errorModal } from '../../../../_utils/sweetalert2-modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-company-image-card',
  standalone: true,
  imports: [CommonModule, BackdropLoadingComponent],
  templateUrl: './company-image-card.component.html',
  styleUrls: ['./company-image-card.component.css']
})
export class CompanyImageCardComponent implements OnInit {
  isLoadingCompany: boolean = true; // Renamed from isLoading for consistency
  isFullScreenLoading: boolean = false;
  // fileList: Array<{ uid: number, url: string }>
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

  fetchImages(): void {
    this.isLoadingCompany = true;
    this.companyImageService.getCompanyImages().subscribe({
      next: (res) => {
        const results = res.data?.results || [];
        this.fileList = results.map((item: any) => ({
          uid: item.id,
          url: item.imageUrl
        }));
        this.isLoadingCompany = false;
      },
      error: (err) => {
        console.error('Fetch images error:', err);
        this.toastrMessages.error('Không thể tải danh sách ảnh', 'Lỗi');
        this.isLoadingCompany = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files: FileList | null = input.files;
    if (!files?.length) return;

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        this.toastrMessages.error(`File ${file.name} phải là .jpg hoặc .png`, 'Lỗi');
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.toastrMessages.error(`File ${file.name} vượt quá 5MB`, 'Lỗi');
        continue;
      }
      validFiles.push(file);
    }

    if (!validFiles.length) return;

    const formData = new FormData();
    validFiles.forEach(file => formData.append('files', file));

    this.uploadFiles(formData, input);
  }

  uploadFiles(formData: FormData, input: HTMLInputElement): void {
    this.isFullScreenLoading = true;
    this.companyImageService.addCompanyImage(formData).subscribe({
      next: (res) => {
        const results = res.data || [];
        const newImages = results.map((item: any) => ({
          uid: item.id,
          url: item.imageUrl
        }));
        this.fileList = [...this.fileList, ...newImages];
        this.toastrMessages.success('Tải ảnh lên thành công');
        this.isFullScreenLoading = false;
        input.value = ''; // Reset input
      },
      error: (err) => {
        errorModal('Lỗi', 'Không thể tải ảnh lên');
        console.error('Upload error:', err);
        this.isFullScreenLoading = false;
      }
    });
  }

  onDeleteImage(image: any): void {
    confirmModal(() => {
      this.isFullScreenLoading = true;
      this.companyImageService.deleteCompanyImage(image.uid).subscribe({
        next: () => {
          this.fileList = this.fileList.filter(item => item.uid !== image.uid);
          this.toastrMessages.success('Xóa ảnh thành công');
          this.isFullScreenLoading = false;
        },
        error: (err) => {
          errorModal('Lỗi', 'Không thể xóa ảnh');
          console.error('Delete error:', err);
          this.isFullScreenLoading = false;
        }
      });
    }, 'Xóa hình ảnh', 'Bạn có chắc chắn muốn xóa ảnh này?', 'warning');
  }

  onPreviewImage(image: any): void {
    this.previewImage = image.url;
    this.previewVisible = true;
  }
}

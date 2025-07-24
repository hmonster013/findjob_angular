import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyImageService } from '../../../../_services/company-image.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-company-image-card',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './company-image-card.component.html',
  styleUrls: ['./company-image-card.component.css']
})
export class CompanyImageCardComponent implements OnInit {
  isLoadingCompany: boolean = true;
  fileList: any[] = [];
  previewImage: string = '';
  previewVisible: boolean = false;
  Math = Math;

  constructor(private companyImageService: CompanyImageService) {}

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
      error: () => {
        Swal.fire({
          title: 'Lỗi',
          text: 'Không thể tải danh sách ảnh',
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files: FileList | null = input.files;
    if (!files?.length) return;

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        Swal.fire({
          title: 'Lỗi',
          text: `File ${file.name} phải là .jpg hoặc .png`,
          icon: 'error',
          confirmButtonText: 'Đóng',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700'
          }
        });
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: 'Lỗi',
          text: `File ${file.name} vượt quá 5MB`,
          icon: 'error',
          confirmButtonText: 'Đóng',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700'
          }
        });
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
    this.companyImageService.addCompanyImage(formData).subscribe({
      next: (res) => {
        const results = res.data || [];
        const newImages = results.map((item: any) => ({
          uid: item.id,
          url: item.imageUrl
        }));
        this.fileList = [...this.fileList, ...newImages];
        Swal.fire({
          title: 'Thành công',
          text: 'Tải ảnh lên thành công',
          icon: 'success',
          confirmButtonText: 'Đóng',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700'
          }
        });
        input.value = ''; // Reset input
      },
      error: () => {
        Swal.fire({
          title: 'Lỗi',
          text: 'Không thể tải ảnh lên',
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

  onDeleteImage(image: any): void {
    Swal.fire({
      title: 'Xóa hình ảnh',
      text: 'Bạn có chắc chắn muốn xóa ảnh này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700',
        cancelButton: 'bg-orange-200 text-orange-800 px-4 py-2 rounded-md hover:bg-orange-300 mr-2'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.companyImageService.deleteCompanyImage(image.uid).subscribe({
          next: () => {
            this.fileList = this.fileList.filter(item => item.uid !== image.uid);
            Swal.fire({
              title: 'Thành công',
              text: 'Xóa ảnh thành công',
              icon: 'success',
              confirmButtonText: 'Đóng',
              buttonsStyling: false,
              customClass: {
                confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700'
              }
            });
          },
          error: () => {
            Swal.fire({
              title: 'Lỗi',
              text: 'Không thể xóa ảnh',
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
    });
  }

  onPreviewImage(image: any): void {
    this.previewImage = image.url;
    this.previewVisible = true;
  }
}

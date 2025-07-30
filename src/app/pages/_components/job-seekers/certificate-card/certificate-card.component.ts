import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CertificateFormComponent } from '../certificate-form/certificate-form.component';
import { ResumeService } from '../../../../_services/resume.service';
import { CertificateService } from '../../../../_services/certificate.service';

@Component({
  selector: 'app-certificate-card',
  standalone: true,
  templateUrl: './certificate-card.component.html',
  imports: [CommonModule, CertificateFormComponent],
})
export class CertificateCardComponent implements OnInit {
  certificates: any[] = [];
  isLoadingCertificates = true;
  isFullScreenLoading = false;
  openPopup = false;
  editData: any = null;
  resumeSlug: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private resumeService: ResumeService,
    private certificateService: CertificateService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.resumeSlug = this.route.snapshot.paramMap.get('slug');
    this.loadCertificates();
  }

  loadCertificates() {
    if (!this.resumeSlug) {
      this.toastr.error('Không tìm thấy hồ sơ!');
      this.isLoadingCertificates = false;
      return;
    }
    this.isLoadingCertificates = true;
    this.resumeService.getCertificates(this.resumeSlug).subscribe({
      next: (res) => {
        this.certificates = res.data || [];
      },
      error: (err) => {
        console.error('Error loading certificates:', err);
        this.toastr.error('Có lỗi khi tải danh sách chứng chỉ!');
      },
      complete: () => {
        this.isLoadingCertificates = false;
      },
    });
  }

  handleShowAdd() {
    this.editData = null;
    this.openPopup = true;
  }

  handleShowUpdate(id: number) {
    this.isFullScreenLoading = true;
    this.certificateService.getCertificateById(id).subscribe({
      next: (res) => {
        this.editData = res.data;
        this.openPopup = true;
      },
      error: (err) => {
        console.error('Error loading certificate:', err);
        this.toastr.error('Có lỗi khi tải thông tin chứng chỉ!');
      },
      complete: () => {
        this.isFullScreenLoading = false;
      },
    });
  }

  handleAddOrUpdate = (data: any, id?: number) => {
    this.isFullScreenLoading = true;
    const payload = { ...data, resume: this.resumeSlug };
    if (id) {
      this.certificateService.updateCertificateById(id, payload).subscribe({
        next: () => {
          this.toastr.success('Cập nhật chứng chỉ thành công!');
          this.loadCertificates();
          this.openPopup = false;
        },
        error: (err) => {
          console.error('Error updating certificate:', err);
          this.toastr.error(err.error?.message || 'Có lỗi khi cập nhật chứng chỉ!');
        },
        complete: () => {
          this.isFullScreenLoading = false;
        },
      });
    } else {
      this.certificateService.addCertificates(payload).subscribe({
        next: () => {
          this.toastr.success('Thêm chứng chỉ thành công!');
          this.loadCertificates();
          this.openPopup = false;
        },
        error: (err) => {
          console.error('Error adding certificate:', err);
          this.toastr.error(err.error?.message || 'Có lỗi khi thêm chứng chỉ!');
        },
        complete: () => {
          this.isFullScreenLoading = false;
        },
      });
    }
  };

  handleDelete(id: number) {
    Swal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc muốn xóa chứng chỉ này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ea580c',
      cancelButtonColor: '#d1d5db',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        this.certificateService.deleteCertificateById(id).subscribe({
          next: () => {
            this.toastr.success('Xóa chứng chỉ thành công!');
            this.loadCertificates();
          },
          error: (err) => {
            console.error('Error deleting certificate:', err);
            this.toastr.error('Có lỗi khi xóa chứng chỉ!');
          },
        });
      }
    });
  }
}

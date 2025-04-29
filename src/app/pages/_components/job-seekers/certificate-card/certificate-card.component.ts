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
  styleUrls: ['./certificate-card.component.css'],
  imports: [
    CommonModule,
    CertificateFormComponent
  ],
})
export class CertificateCardComponent implements OnInit {
  certificates: any[] = [];
  isLoadingCertificates = true;
  isFullScreenLoading = false;
  openPopup = false;
  editData: any = null;
  serverErrors: any = null;
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
    if (!this.resumeSlug) return;
    this.isLoadingCertificates = true;
    this.resumeService.getCertificates(this.resumeSlug).subscribe({
      next: (res) => {
        this.certificates = res.data || [];
      },
      error: (err) => {
        console.error('Error loading certificates:', err);
      },
      complete: () => {
        this.isLoadingCertificates = false;
      },
    });
  }

  handleShowAdd() {
    this.serverErrors = null;
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
      },
      complete: () => {
        this.isFullScreenLoading = false;
      },
    });
  }

  handleAddOrUpdate = (data: any) => {
    this.isFullScreenLoading = true;
    if (data.id) {
      this.certificateService.updateCertificateById(data.id, data).subscribe({
        next: () => {
          this.toastr.success('Cập nhật chứng chỉ thành công!');
          this.loadCertificates();
          this.openPopup = false;
        },
        error: (err) => {
          console.error('Error updating certificate:', err);
        },
        complete: () => {
          this.isFullScreenLoading = false;
        },
      });
    } else {
      this.certificateService.addCertificates(data).subscribe({
        next: () => {
          this.toastr.success('Thêm chứng chỉ thành công!');
          this.loadCertificates();
          this.openPopup = false;
        },
        error: (err) => {
          console.error('Error adding certificate:', err);
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
          },
        });
      }
    });
  }
}

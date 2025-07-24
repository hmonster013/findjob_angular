import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { ResumeService } from '../../../../_services/resume.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Thêm DomSanitizer

@Component({
  selector: 'app-cv-card',
  standalone: true,
  templateUrl: './cv-card.component.html',
  styleUrls: ['./cv-card.component.css'],
  imports: [CommonModule, FormsModule],
})
export class CvCardComponent implements OnInit {
  resumeSlug: string | null = null;
  isLoadingCv = true;
  isFullScreenLoading = false;
  openPopup = false;
  file: File | null = null;
  cvUrl: SafeResourceUrl | null = null; // Đổi thành SafeResourceUrl

  constructor(
    private route: ActivatedRoute,
    private resumeService: ResumeService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer // Inject DomSanitizer
  ) {}

  ngOnInit(): void {
    this.resumeSlug = this.route.snapshot.paramMap.get('slug');
    if (this.resumeSlug) {
      this.fetchCv();
    } else {
      this.toastr.error('Slug CV không hợp lệ!');
      this.isLoadingCv = false;
    }
  }

  fetchCv() {
    if (!this.resumeSlug) return;
    this.isLoadingCv = true;
    this.resumeService.getCv(this.resumeSlug).subscribe({
      next: (res) => {
        const url = res.data?.fileUrl || null;
        this.cvUrl = url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null; // Sanitize URL
      },
      error: (err) => {
        console.error('Error fetching CV:', err);
        this.toastr.error('Có lỗi khi tải CV!');
      },
      complete: () => {
        this.isLoadingCv = false;
      },
    });
  }

  handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      if (file.type !== 'application/pdf') {
        this.toastr.error('Vui lòng chọn file PDF!');
        this.file = null;
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.toastr.error('Kích thước file không được vượt quá 5MB!');
        this.file = null;
        return;
      }
      this.file = file;
    } else {
      this.file = null;
    }
  }

  handleSubmit() {
    if (!this.file || !this.resumeSlug) {
      this.toastr.error('Vui lòng chọn file PDF hợp lệ!');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.file);

    this.isFullScreenLoading = true;
    this.resumeService.updateCV(this.resumeSlug, formData).subscribe({
      next: () => {
        this.toastr.success('Tải lên CV thành công!');
        this.openPopup = false;
        this.file = null;
        this.fetchCv();
      },
      error: (err) => {
        console.error('Error uploading CV:', err);
        this.toastr.error('Có lỗi khi tải lên CV!');
      },
      complete: () => {
        this.isFullScreenLoading = false;
      },
    });
  }

  handleOpenUploadPopup() {
    this.openPopup = true;
    this.file = null;
  }
}

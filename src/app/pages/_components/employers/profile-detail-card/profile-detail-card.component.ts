import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ResumeService } from '../../../../_services/resume.service';
import { ToastrService } from 'ngx-toastr';
import { confirmModal, errorModal } from '../../../../_utils/sweetalert2-modal';
import { BackdropLoadingComponent } from '../../../../_components/backdrop-loading/backdrop-loading.component';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { formatDate } from '../../../../_utils/dateHelper';

@Component({
  selector: 'app-profile-detail-card',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BackdropLoadingComponent
],
  templateUrl: './profile-detail-card.component.html',
  styleUrl: './profile-detail-card.component.css'
})
export class ProfileDetailCardComponent {
  resumeSlug: string = '';
  profileDetail: any = null;
  isLoading: boolean = false;
  isFullScreenLoading: boolean = false;
  openSendMailPopup: boolean = false;
  sendMailForm: FormGroup;
  pdfUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private resumeService: ResumeService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.sendMailForm = this.fb.group({
      subject: [''],
      body: [''],
    });
  }

  ngOnInit(): void {
    this.resumeSlug = this.route.snapshot.paramMap.get('slug') || '';
    if (this.resumeSlug) {
      this.fetchProfileDetail();
    }
  }

  fetchProfileDetail() {
    this.isLoading = true;
    this.resumeService.getResumeDetail(this.resumeSlug).subscribe({
      next: (res) => {
        this.profileDetail = res.data;
        if (this.profileDetail.type === 'uploadFile') {
          this.pdfUrl = this.profileDetail?.cvFile?.url || '';
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        errorModal('Lỗi', 'Không thể tải hồ sơ ứng viên');
      }
    });
  }

  onOpenSendMail() {
    this.openSendMailPopup = true;
  }

  onCloseSendMail() {
    this.openSendMailPopup = false;
  }

  onSendMail() {
    const formValue = this.sendMailForm.value;
    if (!formValue.subject || !formValue.body) {
      this.toastr.warning('Vui lòng nhập đầy đủ tiêu đề và nội dung');
      return;
    }
    this.isFullScreenLoading = true;
    this.resumeService.sendEmail(this.profileDetail.id, formValue).subscribe({
      next: () => {
        this.toastr.success('Gửi email thành công');
        this.openSendMailPopup = false;
        this.isFullScreenLoading = false;
      },
      error: () => {
        this.isFullScreenLoading = false;
        errorModal('Lỗi', 'Gửi email thất bại');
      }
    });
  }

  printProfile() {
    window.print();
  }

  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  formatDate(date: string): string {
    return formatDate(date);
  }
}

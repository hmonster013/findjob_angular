import { IMAGES } from './../../../../_configs/constants';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ResumeService } from '../../../../_services/resume.service';
import { CommonService } from '../../../../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { errorModal } from '../../../../_utils/sweetalert2-modal';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { SendMailCardComponent } from '../send-mail-card/send-mail-card.component';
import { formatDate } from '../../../../_utils/dateHelper';

@Component({
  selector: 'app-profile-detail-card',
  standalone: true,
  imports: [
    CommonModule,
    SendMailCardComponent
  ],
  templateUrl: './profile-detail-card.component.html',
  styleUrls: ['./profile-detail-card.component.css'],
})
export class ProfileDetailCardComponent implements OnInit, OnDestroy {
  resumeSlug: string = '';
  profileDetail: any = null;
  isLoading: boolean = false;
  openSendMailPopup: boolean = false;
  sendMailData: any = null;
  pdfUrl: string = '';
  configs: any = {};
  private destroy$ = new Subject<void>();

  IMAGES = IMAGES;

  constructor(
    private route: ActivatedRoute,
    private resumeService: ResumeService,
    private commonService: CommonService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.resumeSlug = this.route.snapshot.paramMap.get('slug') || '';
    if (this.resumeSlug) {
      this.fetchConfigs();
      this.fetchProfileDetail();
      this.viewResume();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchConfigs() {
    this.commonService.getConfigs().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.configs = res.data || {};
      },
      error: () => {
        this.toastr.error('Không thể tải cấu hình hệ thống!');
      },
    });
  }

  fetchProfileDetail() {
    this.isLoading = true;
    this.resumeService.getResumeDetail(this.resumeSlug).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.profileDetail = res.data;
        console.log('Profile Detail:', this.profileDetail); // Debug giá trị profileDetail
        if (this.profileDetail?.type === 'uploadFile') {
          this.pdfUrl = this.profileDetail?.cvFile?.url || '';
          if (!this.pdfUrl) {
            this.toastr.warning('Không tìm thấy file CV');
          }
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        errorModal('Lỗi', 'Không thể tải hồ sơ ứng viên');
      },
    });
  }

  viewResume() {
    this.resumeService.viewResume(this.resumeSlug).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        // Ghi nhận lượt xem thành công
      },
      error: (err) => {
        console.error('Lỗi khi ghi nhận lượt xem:', err);
      },
    });
  }

  handleSave() {
    this.resumeService.saveResume(this.resumeSlug).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        console.log('Save Resume Response:', res); // Debug response từ API
        const isSaved = res.data?.isSaved ?? !this.profileDetail.isSaved; // Fallback nếu API không trả isSaved
        this.profileDetail.isSaved = isSaved;
        this.toastr.success(isSaved ? 'Lưu hồ sơ thành công!' : 'Hủy lưu hồ sơ thành công!');
      },
      error: (err) => {
        console.error('Lỗi khi lưu hồ sơ:', err); // Debug lỗi
        errorModal('Lỗi', 'Lưu hồ sơ thất bại');
      },
    });
  }

  onOpenSendMail() {
    if (!this.profileDetail?.user?.fullName || !this.profileDetail?.user?.email) {
      this.toastr.warning('Thông tin ứng viên không đầy đủ!');
      return;
    }
    this.sendMailData = {
      id: this.profileDetail.id,
      fullName: this.profileDetail.user.fullName,
      email: this.profileDetail.user.email,
      title: `Thư mời ứng tuyển`,
      content: '',
      isSendMe: true,
      isSentEmail: this.profileDetail.isSentEmail || false,
    };
    this.openSendMailPopup = true;
  }

  handleSendEmail(formData: any) {
    this.resumeService.sendEmail(formData.id, formData).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.toastr.success('Gửi email thành công!');
        this.openSendMailPopup = false;
        this.profileDetail.isSentEmail = true;
      },
      error: () => {
        errorModal('Lỗi', 'Gửi email thất bại');
      },
    });
  }

  printProfile() {
    window.print();
  }

  getSafeHtml(content: any[], type: string): SafeHtml {
    if (!Array.isArray(content) || content.length === 0) {
      return this.sanitizer.bypassSecurityTrustHtml('<p class="no-data">Chưa có thông tin</p>');
    }
    let html = '';
    if (type === 'experience') {
      html = content
        .map((item: any) => `
          <div class="experience-item">
            <h3>${item.jobName || '---'}</h3>
            <p><strong>Công ty:</strong> ${item.companyName || '---'}</p>
            <p><strong>Thời gian:</strong> ${item.startDate ? formatDate(item.startDate) : '---'} - ${item.endDate ? formatDate(item.endDate) : 'Hiện tại'}</p>
            <p>${item.description || 'Chưa có mô tả'}</p>
          </div>
        `)
        .join('<hr>');
    } else if (type === 'education') {
      html = content
        .map((item: any) => `
          <div class="education-item">
            <h3>${item.degreeName || '---'} - Chuyên ngành: ${item.major || '---'}</h3>
            <p><strong>Trường học:</strong> ${item.trainingPlaceName || '---'}</p>
            <p><strong>Thời gian:</strong> ${item.startDate ? formatDate(item.startDate) : '---'} - ${item.completedDate ? formatDate(item.completedDate) : 'Hiện tại'}</p>
          </div>
        `)
        .join('<hr>');
    } else if (type === 'certificate') {
      html = content
        .map((item: any) => `
          <div class="certificate-item">
            <h3>${item.name || '---'}</h3>
            <p><strong>Nơi cấp:</strong> ${item.trainingPlace || '---'}</p>
            <p><strong>Thời gian:</strong> ${item.startDate ? formatDate(item.startDate) : '---'} ${item.expirationDate ? `- ${formatDate(item.expirationDate)}` : '(Không thời hạn)'}</p>
          </div>
        `)
        .join('<hr>');
    } else if (type === 'language' || type === 'skill') {
      html = content
        .map((item: any) => `
          <div class="skill-item">
            <h3>${item.name || item.language ? this.configs.languageDict?.[item.language] || item.name : '---'}</h3>
            <div class="rating">
              ${'<span class="star filled">★</span>'.repeat(item.level || 0)}
              ${'<span class="star">★</span>'.repeat(5 - (item.level || 0))}
            </div>
          </div>
        `)
        .join('');
    }
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  getPersonalInfoHtml(): SafeHtml {
    const { jobSeekerProfile } = this.profileDetail;
    if (!jobSeekerProfile) {
      return this.sanitizer.bypassSecurityTrustHtml('<p class="no-data">Chưa có thông tin</p>');
    }
    const { phone, birthday, gender, maritalStatus, location } = jobSeekerProfile;
    const html = `
      <div class="info-grid">
        <div class="info-item"><strong>Số điện thoại:</strong> ${phone || '---'}</div>
        <div class="info-item"><strong>Ngày sinh:</strong> ${birthday ? formatDate(birthday) : '---'}</div>
        <div class="info-item"><strong>Giới tính:</strong> ${gender ? this.configs.genderDict?.[gender] || '---' : '---'}</div>
        <div class="info-item"><strong>Tình trạng hôn nhân:</strong> ${maritalStatus ? this.configs.maritalStatusDict?.[maritalStatus] || '---' : '---'}</div>
        <div class="info-item"><strong>Địa chỉ:</strong> ${location ? this.configs.cityDict?.[location.city] || '---' : '---'}</div>
      </div>
    `;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  getGeneralInfoHtml(): SafeHtml {
    const { title, position, academicLevel, experience, career, city, salaryMin, salaryMax, typeOfWorkplace, jobType } = this.profileDetail;
    const salary = salaryMin && salaryMax ? `${salaryMin.toLocaleString()} - ${salaryMax.toLocaleString()} VND` : '---';
    const html = `
      <div class="info-grid">
        <div class="info-item"><strong>Vị trí mong muốn:</strong> ${title || '---'}</div>
        <div class="info-item"><strong>Cấp bậc:</strong> ${position ? this.configs.positionDict?.[position] || '---' : '---'}</div>
        <div class="info-item"><strong>Trình độ học vấn:</strong> ${academicLevel ? this.configs.academicLevelDict?.[academicLevel] || '---' : '---'}</div>
        <div class="info-item"><strong>Kinh nghiệm:</strong> ${experience ? this.configs.experienceDict?.[experience] || '---' : '---'}</div>
        <div class="info-item"><strong>Nghề nghiệp:</strong> ${career ? this.configs.careerDict?.[career] || '---' : '---'}</div>
        <div class="info-item"><strong>Địa điểm làm việc:</strong> ${city ? this.configs.cityDict?.[city] || '---' : '---'}</div>
        <div class="info-item"><strong>Mức lương mong muốn:</strong> ${salary}</div>
        <div class="info-item"><strong>Nơi làm việc:</strong> ${typeOfWorkplace ? this.configs.typeOfWorkplaceDict?.[typeOfWorkplace] || '---' : '---'}</div>
        <div class="info-item"><strong>Hình thức làm việc:</strong> ${jobType ? this.configs.jobTypeDict?.[jobType] || '---' : '---'}</div>
      </div>
    `;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  getCareerGoalHtml(): SafeHtml {
    const { description } = this.profileDetail;
    return this.sanitizer.bypassSecurityTrustHtml(
      description ? `<p>${description}</p>` : '<p class="no-data">Chưa có thông tin</p>'
    );
  }

  formatDate(date: string): string {
    return formatDate(date) || '---';
  }
}

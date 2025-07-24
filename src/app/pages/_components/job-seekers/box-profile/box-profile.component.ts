import { IMAGES } from './../../../../_configs/constants';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ResumeService } from '../../../../_services/resume.service';
import { JobSeekerProfileService } from '../../../../_services/job-seeker-profile.service';
import { CV_TYPES } from '../../../../_configs/constants';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-box-profile',
  standalone: true,
  templateUrl: './box-profile.component.html',
  styleUrls: ['./box-profile.component.css'],
  imports: [CommonModule, FormsModule],
})
export class BoxProfileComponent implements OnInit, OnDestroy {
  @Input() currentUser: any = null;
  @Input() allConfig: any = null;

  isLoadingResume = true;
  isFullScreenLoading = false;
  isGeneratingPDF = false;
  resume: any = null;
  selectedColor = '#f59e0b';
  openColorPicker = false;
  private destroy$ = new Subject<void>();

  // Màu sắc preset cho CV
  presetColors = [
    { name: 'Cam Chính thức', value: '#f59e0b', description: 'Màu cam chuyên nghiệp' },
    { name: 'Xanh Dương', value: '#3b82f6', description: 'Màu xanh dương tin cậy' },
    { name: 'Xanh Lá', value: '#10b981', description: 'Màu xanh lá tươi mới' },
    { name: 'Tím', value: '#8b5cf6', description: 'Màu tím sáng tạo' },
    { name: 'Đỏ', value: '#ef4444', description: 'Màu đỏ năng động' },
    { name: 'Hồng', value: '#ec4899', description: 'Màu hồng thời trang' },
    { name: 'Xám Đậm', value: '#374151', description: 'Màu xám thanh lịch' },
    { name: 'Nâu', value: '#a16207', description: 'Màu nâu ấm áp' }
  ];

  IMAGES = IMAGES;

  constructor(
    private jobSeekerProfileService: JobSeekerProfileService,
    private resumeService: ResumeService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.currentUser?.id) {
      this.fetchResumes();
    } else {
      console.warn('No current user, skipping fetchResumes');
      this.isLoadingResume = false;
    }
  }

  fetchResumes() {
    this.isLoadingResume = true;
    this.jobSeekerProfileService
      .getResumes(this.currentUser.jobSeekerProfile.id, { resumeType: CV_TYPES.cvWebsite })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.resume = res.data || null;
        },
        error: (err) => {
          console.error('Error fetching resumes:', err);
          this.toastr.error('Không thể tải hồ sơ');
          this.resume = null;
        },
        complete: () => {
          this.isLoadingResume = false;
        },
      });
  }

  handleActiveResume(slug: string) {
    this.isFullScreenLoading = true;
    this.resumeService
      .activeResume(slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastr.success('Kích hoạt hồ sơ thành công!');
          this.fetchResumes();
        },
        error: (err) => {
          console.error('Error activating resume:', err);
          this.toastr.error('Không thể kích hoạt hồ sơ');
        },
        complete: () => {
          this.isFullScreenLoading = false;
        },
      });
  }

  handleEditResume(slug: string) {
    this.router.navigate(['/bang-dieu-khien/ho-so-tung-buoc', slug]);
  }

  handleDownloadPDF() {
    this.openColorPicker = true;
  }

  handleColorSelect(color: string) {
    this.selectedColor = color;
    this.isGeneratingPDF = true;

    // Tạo HTML content cho CV
    const cvContent = this.createCVHTML(color);

    // Tạo element tạm thời để render
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cvContent;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.style.width = '794px'; // A4 width in pixels (210mm * 3.78)
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    document.body.appendChild(tempDiv);

    // Sử dụng html2canvas để tạo image
    html2canvas(tempDiv, {
      useCORS: true,
      allowTaint: true
    }).then(canvas => {
      // Xóa element tạm thời
      document.body.removeChild(tempDiv);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      // Thêm image vào PDF
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Thêm trang đầu tiên
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Thêm các trang tiếp theo nếu cần
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Lưu file
      const fileName = `${this.currentUser?.fullName || 'cv'}-${this.resume?.title || 'resume'}.pdf`;
      pdf.save(fileName);

      this.toastr.success('Tải PDF thành công!');
      this.isGeneratingPDF = false;
      this.openColorPicker = false;
    }).catch(error => {
      console.error('Error generating PDF:', error);
      document.body.removeChild(tempDiv);
      this.toastr.error('Có lỗi xảy ra khi tạo PDF');
      this.isGeneratingPDF = false;
      this.openColorPicker = false;
    });
  }

  private createCVHTML(color: string): string {
    const hexColor = color;

    return `
      <div style="padding: 40px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333;">
        <!-- Header -->
        <div style="background: ${hexColor}; color: white; padding: 30px; margin: -40px -40px 30px -40px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">${this.resume?.title || 'Chưa có tiêu đề'}</h1>
          <h2 style="margin: 10px 0 0 0; font-size: 20px; font-weight: normal;">${this.currentUser?.fullName || 'Chưa có tên'}</h2>
        </div>

        <!-- Thông tin cơ bản -->
        <div style="margin-bottom: 25px;">
          <h3 style="color: ${hexColor}; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid ${hexColor}; padding-bottom: 5px;">
            📋 THÔNG TIN CƠ BẢN
          </h3>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span><strong>Kinh nghiệm:</strong></span>
              <span>${this.allConfig?.experienceDict?.[this.resume.experience] || 'Chưa cập nhật'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span><strong>Cấp bậc:</strong></span>
              <span>${this.allConfig?.positionDict?.[this.resume.position] || 'Chưa cập nhật'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span><strong>Mức lương mong muốn:</strong></span>
              <span>${this.formatSalary(this.resume.salaryMin, this.resume.salaryMax)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span><strong>Ngày cập nhật:</strong></span>
              <span>${this.resume.updateAt ? new Date(this.resume.updateAt).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</span>
            </div>
          </div>
        </div>

        ${this.resume.experienceDetails?.length ? this.createExperienceSection(hexColor) : ''}
        ${this.resume.educationDetails?.length ? this.createEducationSection(hexColor) : ''}
        ${this.resume.certificateDetails?.length ? this.createCertificateSection(hexColor) : ''}
        ${this.resume.languageSkills?.length ? this.createLanguageSection(hexColor) : ''}
        ${this.resume.advancedSkills?.length ? this.createSkillsSection(hexColor) : ''}
      </div>
    `;
  }

  private createExperienceSection(color: string): string {
    return `
      <div style="margin-bottom: 25px;">
        <h3 style="color: ${color}; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid ${color}; padding-bottom: 5px;">
          💼 KINH NGHIỆM LÀM VIỆC
        </h3>
        ${this.resume.experienceDetails.map((exp: any) => `
          <div style="background: #f8f9fa; padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 4px solid ${color};">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <strong style="font-size: 16px;">${exp.jobName}</strong>
              <span style="color: #666;">${exp.startDate} - ${exp.endDate || 'Hiện tại'}</span>
            </div>
            <div style="color: ${color}; font-weight: 600; margin-bottom: 8px;">${exp.companyName}</div>
            <div style="color: #555;">${exp.description || ''}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  private createEducationSection(color: string): string {
    return `
      <div style="margin-bottom: 25px;">
        <h3 style="color: ${color}; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid ${color}; padding-bottom: 5px;">
          🎓 HỌC VẤN
        </h3>
        ${this.resume.educationDetails.map((edu: any) => `
          <div style="background: #f8f9fa; padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 4px solid ${color};">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <strong style="font-size: 16px;">${edu.degreeName}</strong>
              <span style="color: #666;">${edu.startDate} - ${edu.completedDate || 'Đang học'}</span>
            </div>
            <div style="color: ${color}; font-weight: 600; margin-bottom: 8px;">${edu.major} - ${edu.trainingPlaceName}</div>
            <div style="color: #555;">${edu.description || ''}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  private createCertificateSection(color: string): string {
    return `
      <div style="margin-bottom: 25px;">
        <h3 style="color: ${color}; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid ${color}; padding-bottom: 5px;">
          🏆 CHỨNG CHỈ
        </h3>
        ${this.resume.certificateDetails.map((cert: any) => `
          <div style="background: #f8f9fa; padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 4px solid ${color};">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <strong style="font-size: 16px;">${cert.name}</strong>
              <span style="color: #666;">${cert.startDate}${cert.expirationDate ? ' - ' + cert.expirationDate : ''}</span>
            </div>
            <div style="color: ${color}; font-weight: 600;">${cert.trainingPlace}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  private createLanguageSection(color: string): string {
    return `
      <div style="margin-bottom: 25px;">
        <h3 style="color: ${color}; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid ${color}; padding-bottom: 5px;">
          🌍 KỸ NĂNG NGÔN NGỮ
        </h3>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
          ${this.resume.languageSkills.map((lang: any) => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 8px; background: white; border-radius: 4px;">
              <span><strong>${lang.language}</strong></span>
              <span style="color: ${color}; font-weight: 600;">${this.allConfig?.languageLevelDict?.[lang.level] || lang.level}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  private createSkillsSection(color: string): string {
    return `
      <div style="margin-bottom: 25px;">
        <h3 style="color: ${color}; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid ${color}; padding-bottom: 5px;">
          🛠️ KỸ NĂNG CHUYÊN MÔN
        </h3>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
          ${this.resume.advancedSkills.map((skill: any) => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 8px; background: white; border-radius: 4px;">
              <span><strong>${skill.name}</strong></span>
              <span style="color: ${color}; font-weight: 600;">${this.allConfig?.skillLevelDict?.[skill.level] || skill.level}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  getResumeStatusText(status: number): string {
    if (!this.allConfig?.resumeStatusOptions) {
      return 'Không xác định';
    }
    const statusItem = this.allConfig.resumeStatusOptions.find(
      (s: any) => s.value === status
    );
    return statusItem?.label || 'Không xác định';
  }

  formatSalary(min: number, max: number): string {
    if (!min && !max) return 'Thỏa thuận';
    const minInMillions = min ? (min / 1000000) : '';
    const maxInMillions = max ? (max / 1000000) : '';
    return `${minInMillions ? minInMillions + ' triệu' : ''} - ${maxInMillions ? maxInMillions + ' triệu' : ''}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

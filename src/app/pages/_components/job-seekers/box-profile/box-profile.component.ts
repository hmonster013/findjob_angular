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
import autoTable from 'jspdf-autotable';

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
  selectedColor = '#f59e0b'; // Màu amber-500 để đồng bộ với giao diện
  openColorPicker = false;
  private destroy$ = new Subject<void>();

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

    const doc = new jsPDF();

    // Header với màu nền
    doc.setFillColor(color);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text(`CV: ${this.resume?.title || 'Untitled'}`, 20, 20);
    doc.setFontSize(14);
    doc.text(`Họ tên: ${this.currentUser?.fullName || 'Unknown'}`, 20, 30);

    // Reset màu chữ cho nội dung
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    let yOffset = 50;

    // Thông tin cơ bản
    doc.text('Thông tin cơ bản', 20, yOffset);
    yOffset += 10;
    autoTable(doc, {
      startY: yOffset,
      body: [
        ['Kinh nghiệm', this.allConfig?.experienceDict?.[this.resume.experience] || 'Chưa cập nhật'],
        ['Cấp bậc', this.allConfig?.positionDict?.[this.resume.position] || 'Chưa cập nhật'],
        ['Mức lương mong muốn', this.formatSalary(this.resume.salaryMin, this.resume.salaryMax)],
        ['Ngày cập nhật', this.resume.updateAt ? new Date(this.resume.updateAt).toLocaleString('vi-VN') : 'Chưa cập nhật'],
      ],
      theme: 'striped',
      styles: { fontSize: 10, cellPadding: 2 },
    });
    yOffset = (doc as any).lastAutoTable.finalY + 10;

    // Kinh nghiệm làm việc
    if (this.resume.experienceDetails?.length) {
      doc.text('Kinh nghiệm làm việc', 20, yOffset);
      yOffset += 10;
      autoTable(doc, {
        startY: yOffset,
        head: [['Vị trí', 'Công ty', 'Thời gian', 'Mô tả']],
        body: this.resume.experienceDetails.map((exp: any) => [
          exp.jobName,
          exp.companyName,
          `${exp.startDate} - ${exp.endDate || 'Hiện tại'}`,
          exp.description,
        ]),
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 2 },
      });
      yOffset = (doc as any).lastAutoTable.finalY + 10;
    }

    // Học vấn
    if (this.resume.educationDetails?.length) {
      doc.text('Học vấn', 20, yOffset);
      yOffset += 10;
      autoTable(doc, {
        startY: yOffset,
        head: [['Bằng cấp', 'Chuyên ngành', 'Trường', 'Thời gian', 'Mô tả']],
        body: this.resume.educationDetails.map((edu: any) => [
          edu.degreeName,
          edu.major,
          edu.trainingPlaceName,
          `${edu.startDate} - ${edu.completedDate || 'Đang học'}`,
          edu.description,
        ]),
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 2 },
      });
      yOffset = (doc as any).lastAutoTable.finalY + 10;
    }

    // Chứng chỉ
    if (this.resume.certificateDetails?.length) {
      doc.text('Chứng chỉ', 20, yOffset);
      yOffset += 10;
      autoTable(doc, {
        startY: yOffset,
        head: [['Tên chứng chỉ', 'Nơi cấp', 'Ngày cấp', 'Hết hạn']],
        body: this.resume.certificateDetails.map((cert: any) => [
          cert.name,
          cert.trainingPlace,
          cert.startDate,
          cert.expirationDate || 'Không có',
        ]),
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 2 },
      });
      yOffset = (doc as any).lastAutoTable.finalY + 10;
    }

    // Kỹ năng ngôn ngữ
    if (this.resume.languageSkills?.length) {
      doc.text('Kỹ năng ngôn ngữ', 20, yOffset);
      yOffset += 10;
      autoTable(doc, {
        startY: yOffset,
        head: [['Ngôn ngữ', 'Trình độ']],
        body: this.resume.languageSkills.map((lang: any) => [
          lang.language,
          this.allConfig?.languageLevelDict?.[lang.level] || lang.level,
        ]),
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 2 },
      });
      yOffset = (doc as any).lastAutoTable.finalY + 10;
    }

    // Kỹ năng chuyên môn
    if (this.resume.advancedSkills?.length) {
      doc.text('Kỹ năng chuyên môn', 20, yOffset);
      yOffset += 10;
      autoTable(doc, {
        startY: yOffset,
        head: [['Kỹ năng', 'Trình độ']],
        body: this.resume.advancedSkills.map((skill: any) => [
          skill.name,
          this.allConfig?.skillLevelDict?.[skill.level] || skill.level,
        ]),
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 2 },
      });
    }

    // Tải PDF
    setTimeout(() => {
      doc.save(`${this.currentUser?.fullName || 'cv'}-${this.resume?.title || 'resume'}.pdf`);
      this.toastr.success('Tải PDF thành công!');
      this.isGeneratingPDF = false;
      this.openColorPicker = false;
    }, 1500);
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
    const minInMillions = min ? (min / 1000000).toFixed(3) : '';
    const maxInMillions = max ? (max / 1000000).toFixed(3) : '';
    return `${minInMillions ? minInMillions + ' triệu' : ''} - ${maxInMillions ? maxInMillions + ' triệu' : ''}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

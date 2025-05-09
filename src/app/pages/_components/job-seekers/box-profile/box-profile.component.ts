import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ResumeService } from '../../../../_services/resume.service';
import jsPDF from 'jspdf';
import { JobSeekerProfileService } from '../../../../_services/job-seeker-profile.service';
import { CV_TYPES } from '../../../../_configs/constants';

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
  selectedColor = '#140861';
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
    doc.setFillColor(color);
    doc.rect(0, 0, 210, 297, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text(`CV: ${this.resume?.title || 'Untitled'}`, 20, 20);
    doc.text(`User: ${this.currentUser?.fullName || 'Unknown'}`, 20, 40);

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
    return `${min ? min + ' triệu' : ''} - ${max ? max + ' triệu' : ''}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

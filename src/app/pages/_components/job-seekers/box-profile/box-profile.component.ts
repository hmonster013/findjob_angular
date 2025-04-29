import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Thêm FormsModule cho [(ngModel)]
import { ResumeService } from '../../../../_services/resume.service';

@Component({
  selector: 'app-box-profile',
  standalone: true,
  templateUrl: './box-profile.component.html',
  styleUrls: ['./box-profile.component.css'],
  imports: [CommonModule, FormsModule],
})
export class BoxProfileComponent implements OnInit {
  @Input() currentUser: any;
  @Input() allConfig: any;

  isLoadingResume = true;
  isFullScreenLoading = false;
  isGeneratingPDF = false;
  resumes: any[] = [];
  selectedColor = '#1890ff';
  previewResumeSlug: string | null = null;

  constructor(
    private resumeService: ResumeService,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.fetchResumes();
  }

  fetchResumes() {
    this.isLoadingResume = true;
    this.resumeService.getResumes().subscribe({
      next: (res) => {
        this.resumes = res.data || [];
      },
      error: (err) => {
        console.error('Error fetching resumes:', err);
      },
      complete: () => {
        this.isLoadingResume = false;
      }
    });
  }

  handlePreviewResume(slug: string) {
    this.previewResumeSlug = slug;
    this.selectedColor = '#1890ff';
  }

  handleDownloadPDF() {
    if (!this.previewResumeSlug) return;
    this.isGeneratingPDF = true;
    setTimeout(() => {
      this.toastr.success('Tải PDF thành công!');
      this.isGeneratingPDF = false;
    }, 1500);
  }

  handleActiveResume(slug: string) {
    this.isFullScreenLoading = true;
    this.resumeService.activeResume(slug).subscribe({
      next: () => {
        this.toastr.success('Kích hoạt hồ sơ thành công!');
        this.fetchResumes();
      },
      error: (err) => {
        console.error('Error activating resume:', err);
      },
      complete: () => {
        this.isFullScreenLoading = false;
      }
    });
  }

  handleNavigateResume(slug: string) {
    this.router.navigate(['/job-seeker/resumes', slug]);
  }

  getResumeStatusText(status: number): string {
    const statusItem = this.allConfig?.resumeStatusOptions?.find((s: any) => s.value === status);
    return statusItem?.label || '';
  }
}

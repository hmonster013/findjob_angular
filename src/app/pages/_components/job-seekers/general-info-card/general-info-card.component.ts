import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GeneralInfoFormComponent } from '../general-info-form/general-info-form.component';
import { ResumeService } from '../../../../_services/resume.service';

@Component({
  selector: 'app-general-info-card',
  standalone: true,
  templateUrl: './general-info-card.component.html',
  styleUrls: ['./general-info-card.component.css'],
  imports: [
    CommonModule,
    GeneralInfoFormComponent
  ],
})
export class GeneralInfoCardComponent implements OnInit {
  resumeDetail: any = null;
  isLoadingResumeDetail = true;
  isFullScreenLoading = false;
  openPopup = false;
  resumeSlug: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private resumeService: ResumeService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.resumeSlug = this.route.snapshot.paramMap.get('slug');
    this.fetchResumeDetail();
  }

  fetchResumeDetail() {
    if (!this.resumeSlug) return;
    this.isLoadingResumeDetail = true;
    this.resumeService.getResumeOwner(this.resumeSlug).subscribe({
      next: (res) => {
        this.resumeDetail = res.data || null;
      },
      error: (err) => {
        console.error('Error fetching resume owner:', err);
      },
      complete: () => {
        this.isLoadingResumeDetail = false;
      },
    });
  }

  handleShowEdit() {
    this.openPopup = true;
  }

  handleUpdate = (data: any) => {
    if (!this.resumeSlug) return;
    this.isFullScreenLoading = true;
    this.resumeService.updateResume(this.resumeSlug, data).subscribe({
      next: () => {
        this.toastr.success('Cập nhật thông tin thành công!');
        this.fetchResumeDetail();
        this.openPopup = false;
      },
      error: (err) => {
        console.error('Error updating resume:', err);
      },
      complete: () => {
        this.isFullScreenLoading = false;
      }
    });
  };
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GeneralInfoFormComponent } from '../general-info-form/general-info-form.component';
import { ResumeService } from '../../../../_services/resume.service';
import { CommonService } from '../../../../_services/common.service';

@Component({
  selector: 'app-general-info-card',
  standalone: true,
  templateUrl: './general-info-card.component.html',
  imports: [CommonModule, GeneralInfoFormComponent],
})
export class GeneralInfoCardComponent implements OnInit {
  resumeDetail: any = null;
  isLoadingResumeDetail = true;
  isFullScreenLoading = false;
  openPopup = false;
  resumeSlug: string | null = null;
  allConfig: any;

  constructor(
    private route: ActivatedRoute,
    private resumeService: ResumeService,
    private commonService: CommonService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getConfigs();
    this.resumeSlug = this.route.snapshot.paramMap.get('slug');
    this.fetchResumeDetail();
  }

  getConfigs() {
    this.commonService.getConfigs().subscribe({
      next: (res) => {
        this.allConfig = res.data;
      },
      error: (err) => {
        this.toastr.error('Lỗi khi tải cấu hình!');
      },
    });
  }

  fetchResumeDetail() {
    if (!this.resumeSlug) {
      this.toastr.error('Không tìm thấy hồ sơ!');
      this.isLoadingResumeDetail = false;
      return;
    }
    this.isLoadingResumeDetail = true;
    this.resumeService.getResumeOwner(this.resumeSlug).subscribe({
      next: (res) => {
        this.resumeDetail = res.data || null;
      },
      error: (err) => {
        console.error('Error fetching resume owner:', err);
        this.toastr.error('Có lỗi khi tải thông tin hồ sơ!');
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
    if (!this.resumeSlug) {
      this.toastr.error('Không tìm thấy hồ sơ!');
      return;
    }
    this.isFullScreenLoading = true;
    this.resumeService.updateResume(this.resumeSlug, data).subscribe({
      next: () => {
        this.toastr.success('Cập nhật thông tin thành công!');
        this.fetchResumeDetail();
        this.openPopup = false;
      },
      error: (err) => {
        console.error('Error updating resume:', err);
        this.toastr.error(err.error?.message || 'Có lỗi khi cập nhật thông tin!');
      },
      complete: () => {
        this.isFullScreenLoading = false;
      },
    });
  };
}

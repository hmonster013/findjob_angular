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
  imports: [CommonModule, GeneralInfoFormComponent],
})
export class GeneralInfoCardComponent implements OnInit {
  resumeDetail: any = null;
  isLoadingResumeDetail = true;
  isFullScreenLoading = false;
  openPopup = false;
  resumeSlug: string | null = null;
  allConfig: any = {
    positionOptions: [
      { value: 'INTERN', label: 'Thực tập sinh' },
      { value: 'JUNIOR', label: 'Nhân viên' },
      { value: 'SENIOR', label: 'Chuyên viên' },
    ],
    academicLevelOptions: [
      { value: 'HIGH_SCHOOL', label: 'Trung học' },
      { value: 'BACHELOR', label: 'Cử nhân' },
      { value: 'MASTER', label: 'Thạc sĩ' },
    ],
    experienceOptions: [
      { value: '0', label: 'Chưa có kinh nghiệm' },
      { value: '1', label: '1-2 năm' },
      { value: '2', label: 'Trên 2 năm' },
    ],
    careerOptions: [
      { value: 'IT', label: 'Công nghệ thông tin' },
      { value: 'MARKETING', label: 'Marketing' },
    ],
    cityOptions: [
      { value: '1', label: 'Hà Nội' },
      { value: '2', label: 'TP. Hồ Chí Minh' },
    ],
    typeOfWorkplaceOptions: [
      { value: 'ONSITE', label: 'Tại văn phòng' },
      { value: 'REMOTE', label: 'Từ xa' },
    ],
    jobTypeOptions: [
      { value: 'FULL_TIME', label: 'Toàn thời gian' },
      { value: 'PART_TIME', label: 'Bán thời gian' },
    ],
  };

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
        this.toastr.error('Có lỗi xảy ra khi cập nhật thông tin!');
      },
      complete: () => {
        this.isFullScreenLoading = false;
      },
    });
  };
}

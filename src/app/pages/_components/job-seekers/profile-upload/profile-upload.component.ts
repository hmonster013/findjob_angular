import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ProfileUploadFormComponent } from '../profile-upload-form/profile-upload-form.component';
import { CV_TYPES, ROUTES } from '../../../../_configs/constants';
import { ResumeService } from '../../../../_services/resume.service';
import { JobSeekerProfileService } from '../../../../_services/job-seeker-profile.service';
import { Router } from '@angular/router';

interface Resume {
  slug: string;
  title: string;
  updatedAt: string;
  isActive: boolean;
  fileUrl?: string;
}

@Component({
  selector: 'app-profile-upload',
  standalone: true,
  templateUrl: './profile-upload.component.html',
  styleUrls: ['./profile-upload.component.css'],
  imports: [CommonModule, ProfileUploadFormComponent],
})
export class ProfileUploadComponent implements OnInit {
  @Input() allConfig: any = {};
  @Input() jobSeekerProfileId!: number;

  resumes: Resume[] = [];
  isLoadingResumes = true;
  isFullScreenLoading = false;
  openPopup = false;
  CV_UPLOAD = CV_TYPES.cvUpload;

  constructor(
    private jobSeekerProfileService: JobSeekerProfileService,
    private resumeService: ResumeService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.jobSeekerProfileId && !isNaN(this.jobSeekerProfileId)) {
      this.loadResumes();
    } else {
      this.toastr.error('ID hồ sơ không hợp lệ!');
      this.isLoadingResumes = false;
    }
  }

  loadResumes(): void {
    this.isLoadingResumes = true;
    const params = { resumeType: this.CV_UPLOAD };
    this.jobSeekerProfileService.getResumes(this.jobSeekerProfileId, params).subscribe({
      next: (res) => {
        this.resumes = res.data || [];
      },
      error: (err) => {
        console.error('Error loading resumes:', err);
        this.toastr.error('Có lỗi khi tải danh sách CV!');
      },
      complete: () => {
        this.isLoadingResumes = false;
      },
    });
  }

  handleShowUpload(): void {
    this.openPopup = true;
  }

  handleUpload(data: any): void {
    if (!data.file || data.file.type !== 'application/pdf') {
      this.toastr.error('Vui lòng chọn file PDF!');
      return;
    }

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    formData.append('resumeType', this.CV_UPLOAD);

    this.isFullScreenLoading = true;
    this.resumeService.addResume(formData).subscribe({
      next: () => {
        this.toastr.success('Tải lên CV thành công!');
        this.loadResumes();
        this.openPopup = false;
      },
      error: (err) => {
        console.error('Error uploading resume:', err);
        this.toastr.error('Có lỗi khi tải lên CV!');
      },
      complete: () => {
        this.isFullScreenLoading = false;
      },
    });
  }

  handleDeleteResume(slug: string): void {
    Swal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc chắn muốn xóa CV này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md',
        cancelButton: 'bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.resumeService.deleteResume(slug).subscribe({
          next: () => {
            this.toastr.success('Xóa CV thành công!');
            this.loadResumes();
          },
          error: (err) => {
            console.error('Error deleting resume:', err);
            this.toastr.error('Có lỗi khi xóa CV!');
          },
        });
      }
    });
  }

  handleActiveResume(slug: string): void {
    this.isFullScreenLoading = true;
    this.resumeService.activeResume(slug).subscribe({
      next: () => {
        this.toastr.success('Đã cập nhật trạng thái tìm kiếm!');
        this.loadResumes();
      },
      error: (err) => {
        console.error('Error toggling resume activation:', err);
        this.toastr.error('Có lỗi khi cập nhật trạng thái!');
      },
      complete: () => {
        this.isFullScreenLoading = false;
      },
    });
  }

  handleEditResume(slug: string): void {
    this.router.navigate([`${ROUTES.JOB_SEEKER.DASHBOARD}/${ROUTES.JOB_SEEKER.ATTACHED_PROFILE}/${slug}`]);
  }

  handleDownloadResume(fileUrl?: string): void {
    if (!fileUrl) {
      this.toastr.error('Không tìm thấy file để tải!');
      return;
    }
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = '';
    link.click();
  }
}

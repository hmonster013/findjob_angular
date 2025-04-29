import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ProfileUploadFormComponent } from '../profile-upload-form/profile-upload-form.component';
import { CV_TYPES } from '../../../../_configs/constants';
import { ResumeService } from '../../../../_services/resume.service';

@Component({
  selector: 'app-profile-upload',
  standalone: true,
  templateUrl: './profile-upload.component.html',
  styleUrls: ['./profile-upload.component.css'],
  imports: [
    CommonModule,
    ProfileUploadFormComponent
  ],
})
export class ProfileUploadComponent implements OnInit {
  resumes: any[] = [];
  isLoadingResumes = true;
  isFullScreenLoading = false;
  openPopup = false;
  allConfig: any = {}; // cần truyền từ component cha thực tế
  jobSeekerProfileId: number | null = null;
  CV_UPLOAD = CV_TYPES.cvUpload;

  constructor(
    private resumeService: ResumeService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.jobSeekerProfileId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.jobSeekerProfileId) {
      this.loadResumes();
    }
  }

  loadResumes() {
    this.isLoadingResumes = true;
    const params = {
      resumeType: this.CV_UPLOAD,
      jobSeekerProfileId: this.jobSeekerProfileId
    };
    this.resumeService.getResumes(params).subscribe({
      next: (res) => {
        this.resumes = res.data || [];
      },
      error: (err) => {
        console.error('Error loading resumes:', err);
      },
      complete: () => {
        this.isLoadingResumes = false;
      }
    });
  }

  handleShowUpload() {
    this.openPopup = true;
  }

  handleUpload(data: any) {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('resumeType', this.CV_UPLOAD);
    formData.append('title', data.title);
    formData.append('position', data.position);
    formData.append('academicLevel', data.academicLevel);
    formData.append('experience', data.experience);
    formData.append('career', data.career);
    formData.append('city', data.city);
    formData.append('salaryMin', data.salaryMin);
    formData.append('salaryMax', data.salaryMax);
    formData.append('typeOfWorkplace', data.typeOfWorkplace);
    formData.append('jobType', data.jobType);
    formData.append('description', data.description);

    this.isFullScreenLoading = true;
    this.resumeService.addResume(formData).subscribe({
      next: () => {
        this.toastr.success('Tải lên CV thành công!');
        this.loadResumes();
        this.openPopup = false;
      },
      error: (err) => {
        console.error('Error uploading resume:', err);
      },
      complete: () => {
        this.isFullScreenLoading = false;
      }
    });
  }

  handleDeleteResume(slug: string) {
    Swal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc chắn muốn xóa CV này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        this.resumeService.deleteResume(slug).subscribe({
          next: () => {
            this.toastr.success('Xóa CV thành công!');
            this.loadResumes();
          },
          error: (err) => {
            console.error('Error deleting resume:', err);
          }
        });
      }
    });
  }

  handleActiveResume(slug: string) {
    this.isFullScreenLoading = true;
    this.resumeService.activeResume(slug).subscribe({
      next: () => {
        this.toastr.success('Đã kích hoạt CV!');
        this.loadResumes();
      },
      error: (err) => {
        console.error('Error activating resume:', err);
      },
      complete: () => {
        this.isFullScreenLoading = false;
      }
    });
  }
}

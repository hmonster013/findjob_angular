import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { JobSeekerProfileService } from '../../_services/job-seeker-profile.service';
import { AuthStateService } from '../../_services/auth-state.service';
import { ROUTES } from '../../_configs/constants';

@Component({
  selector: 'app-apply-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './apply-form.component.html',
  styleUrls: ['./apply-form.component.css'],
})
export class ApplyFormComponent {
  @Input() jobPostId: number | null = null;
  @Output() submitApply = new EventEmitter<any>();

  applyForm: FormGroup;
  isLoadingResumes = false;
  resumes: any[] = [];
  applyFormSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private jobSeekerProfileService: JobSeekerProfileService,
    private authStateService: AuthStateService,
    private toastr: ToastrService
  ) {
    // Khởi tạo form
    this.applyForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      phone: ['', [Validators.required, Validators.pattern(/^0[0-9]{9}$/)]],
      resume: ['', Validators.required],
    });

    // Tự động điền dữ liệu từ currentUser
    const currentUser = this.authStateService.getCurrentUser();
    if (currentUser) {
      this.applyForm.patchValue({
        fullName: currentUser.fullName || '',
        email: currentUser.email || '',
        phone: currentUser.jobSeekerProfile?.phone || '',
      });
    }

    // Tải danh sách hồ sơ
    this.loadResumes();
  }

  loadResumes() {
    this.isLoadingResumes = true;
    const jobSeekerProfileId = this.authStateService.getCurrentUser()?.jobSeekerProfile?.id;

    if (!jobSeekerProfileId) {
      this.toastr.error('Không tìm thấy thông tin người dùng');
      this.isLoadingResumes = false;
      return;
    }

    this.jobSeekerProfileService.getResumes(jobSeekerProfileId).subscribe({
      next: (res) => {
        this.resumes = res.data.map((resume: any) => ({
          ...resume,
          type: resume.type === 'WEBSITE' ? 'WEBSITE' : 'UPLOAD', // Ánh xạ type
        }));
        // Tự động chọn hồ sơ đầu tiên nếu có
        if (this.resumes.length > 0) {
          this.applyForm.controls['resume'].setValue(this.resumes[0].id);
        }
        this.isLoadingResumes = false;
      },
      error: (err) => {
        this.toastr.error('Không thể tải danh sách hồ sơ');
        this.isLoadingResumes = false;
      },
    });
  }

  onSubmit() {
    this.applyFormSubmitted = true;
    if (this.applyForm.valid) {
      this.submitApply.emit({
        ...this.applyForm.value,
        jobPostId: this.jobPostId,
      });
    } else {
      this.applyForm.markAllAsTouched();
    }
  }

  getResumeLink(resume: any): string {
    if (resume.type === 'WEBSITE') {
      return `${ROUTES.JOB_SEEKER.DASHBOARD}/${ROUTES.JOB_SEEKER.STEP_PROFILE}/${resume.slug}`;
    } else {
      return `${ROUTES.JOB_SEEKER.DASHBOARD}/${ROUTES.JOB_SEEKER.ATTACHED_PROFILE}/${resume.slug}`;
    }
  }
}

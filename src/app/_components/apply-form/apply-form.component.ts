import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-apply-form',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './apply-form.component.html',
  styleUrl: './apply-form.component.css'
})
export class ApplyFormComponent {
  @Output() submitApply = new EventEmitter<any>();

  applyForm: FormGroup;
  isLoadingResumes = false;
  resumes: any[] = [];

  constructor(private fb: FormBuilder) {
    this.applyForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      phone: ['', [Validators.required, Validators.pattern(/^0[0-9]{9}$/)]],
      resume: ['', Validators.required],
    });

    this.loadResumes();
  }

  loadResumes() {
    this.isLoadingResumes = true;

    // Simulate API call
    setTimeout(() => {
      this.resumes = [
        { id: 1, title: 'CV Website - Nguyễn Văn A', type: 'cvWebsite', slug: 'nguyen-van-a' },
        { id: 2, title: 'CV Upload - Nguyễn Văn B', type: 'cvUpload', slug: 'nguyen-van-b' },
      ];
      // Default chọn resume đầu tiên
      this.applyForm.patchValue({ resume: this.resumes[0].id });
      this.isLoadingResumes = false;
    }, 1000);
  }

  onSubmit() {
    if (this.applyForm.valid) {
      this.submitApply.emit(this.applyForm.value);
    } else {
      this.applyForm.markAllAsTouched();
    }
  }

  getResumeLink(resume: any): string {
    if (resume.type === 'cvWebsite') {
      return `/dashboard/step-profile/${resume.slug}`;
    } else {
      return `/dashboard/attached-profile/${resume.slug}`;
    }
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JobSeekerProfileService } from '../../../_services/job-seeker-profile.service';
import { AuthStateService } from '../../../_services/auth-state.service';

@Component({
  selector: 'app-job-application-card',
  imports: [
    CommonModule
  ],
  templateUrl: './job-application-card.component.html',
  styleUrl: './job-application-card.component.css'
})
export class JobApplicationCardComponent {
  isLoading = true;
  resumes: any[] = [];

  constructor(
    private router: Router,
    private jobSeekerProfileService: JobSeekerProfileService,
    private authStateService: AuthStateService
  ) {}

  ngOnInit(): void {
    this.fetchResumes();
  }

  fetchResumes(): void {
    this.isLoading = true;
    const jobSeekerProfileId = this.authStateService.getCurrentUser()?.jobSeekerProfileId;

    if (!jobSeekerProfileId) {
      this.isLoading = false;
      return;
    }

    this.jobSeekerProfileService.getResumes(jobSeekerProfileId).subscribe({
      next: (res) => {
        this.resumes = res.data || [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  navigateToProfile(): void {
    this.router.navigate(['/job-seeker/dashboard/profile']);
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { formatDate } from '@angular/common';
import { JobSeekerProfileService } from '../../../../_services/job-seeker-profile.service';
import { ROUTES } from '../../../../_configs/constants';

@Component({
  selector: 'app-job-application-card',
  standalone: true,
  templateUrl: './job-application-card.component.html',
  styleUrls: ['./job-application-card.component.css'],
  imports: [CommonModule, RouterModule],
})
export class JobApplicationCardComponent implements OnInit {
  @Input() jobSeekerProfileId!: number;

  isLoading = true;
  resumes: any[] = [];

  constructor(
    private jobSeekerProfileService: JobSeekerProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.jobSeekerProfileId) {
      this.fetchResumes();
    }
  }

  fetchResumes() {
    this.isLoading = true;
    this.jobSeekerProfileService.getResumes(this.jobSeekerProfileId).subscribe({
      next: (res) => {
        this.resumes = res.data;
      },
      error: (err) => {
        console.error('Error fetching resumes:', err);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  handleNavigate(slug: string) {
    this.router.navigate([ROUTES.JOB_SEEKER.DASHBOARD + "/" + ROUTES.JOB_SEEKER.STEP_PROFILE, slug]);
  }

  navigateToProfile() {
    this.router.navigate([ROUTES.JOB_SEEKER.DASHBOARD + "/" + ROUTES.JOB_SEEKER.PROFILE]);
  }

  formatDateDisplay(dateStr: string): string {
    return formatDate(dateStr, 'dd/MM/yyyy', 'en-US');
  }
}

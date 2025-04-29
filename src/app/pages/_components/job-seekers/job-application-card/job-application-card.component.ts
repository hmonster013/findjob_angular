import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { formatDate } from '@angular/common';
import { ResumeService } from '../../../../_services/resume.service';

@Component({
  selector: 'app-job-application-card',
  standalone: true,
  templateUrl: './job-application-card.component.html',
  styleUrls: ['./job-application-card.component.css'],
  imports: [
    CommonModule,
    RouterModule
  ],
})
export class JobApplicationCardComponent implements OnInit {
  @Input() jobSeekerProfileId!: number;

  isLoading = true;
  resumes: any[] = [];

  constructor(
    private resumeService: ResumeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.jobSeekerProfileId) {
      this.fetchResumes();
    }
  }

  fetchResumes() {
    this.isLoading = true;
    const params = {
      isDeleted: false,
      jobSeekerProfileId: this.jobSeekerProfileId,  // Thêm vào param
    };
    this.resumeService.getResumes(params).subscribe({
      next: (res) => {
        this.resumes = res.data || [];
      },
      error: (err) => {
        console.error('Error fetching resumes:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }


  handleNavigate(slug: string) {
    this.router.navigate(['/job-seeker/resumes', slug]);
  }

  formatDateDisplay(dateStr: string): string {
    return formatDate(dateStr, 'dd/MM/yyyy', 'en-US');
  }
}

import { Component, HostListener, Input } from '@angular/core';
import { JobService } from '../../../../_services/job.service';
import { ROLES_NAME } from '../../../../_configs/constants';
import { Subject, takeUntil } from 'rxjs';
import { JobPostComponent } from "../../../../_components/job-post/job-post.component";
import { NoDataCardComponent } from "../../../../_components/no-data-card/no-data-card.component";
import { CommonModule } from '@angular/common';
import { AuthStateService } from '../../../../_services/auth-state.service';

@Component({
  selector: 'app-suggested-job-post-card',
  imports: [
    JobPostComponent,
    NoDataCardComponent,
    CommonModule
  ],
  templateUrl: './suggested-job-post-card.component.html',
  styleUrl: './suggested-job-post-card.component.css'
})
export class SuggestedJobPostCardComponent {
  @Input() pageSize: number = 12;
  @Input() fullWidth: boolean = false;

  jobPosts: any[] = [];
  isLoading = true;
  page = 1;
  pageCount = 0;
  colClass = 'w-full md:w-1/2 lg:w-1/3';

  constructor(
    private jobService: JobService,
    private authService: AuthStateService
  ) {}

  ngOnInit(): void {
    this.updateColClass();
    this.loadJobs();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.updateColClass();
  }

  updateColClass() {
    if (this.fullWidth) {
      this.colClass = 'w-full md:w-1/2 lg:w-1/3';
    } else {
      const width = document.getElementById('suggested-job-post-card')?.offsetWidth || 1200;
      if (width < 600) this.colClass = 'w-full';
      else if (width < 900) this.colClass = 'w-full md:w-1/2';
      else if (width < 1200) this.colClass = 'w-full md:w-1/2';
      else this.colClass = 'w-full md:w-1/2 lg:w-1/3';
    }
  }

  loadJobs() {
    const currentUser = this.authService.getCurrentUser();
    const isAuthenticated = this.authService.isAuthenticated();

    if (!isAuthenticated || currentUser?.roleName !== ROLES_NAME.JOB_SEEKER) {
      this.isLoading = false;
      return;
    }

    this.isLoading = true;

    this.jobService
      .getSuggestedJobPosts({
        pageSize: this.pageSize,
        page: this.page,
      })
      .subscribe({
        next: (res) => {
          this.jobPosts = res.data.results;
          this.pageCount = Math.ceil(res.data.count / this.pageSize);
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  handleChangePage(newPage: number) {
    this.page = newPage;
    this.loadJobs();
  }
}

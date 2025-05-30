import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService } from '../../../../_services/job.service';
import { CommonService } from '../../../../_services/common.service';
import { AuthStateService } from '../../../../_services/auth-state.service';
import { ToastrService } from 'ngx-toastr';
import { ROLES_NAME } from '../../../../_configs/constants';
import { JobPostComponent } from '../../../../_components/job-post/job-post.component';
import { NoDataCardComponent } from '../../../../_components/no-data-card/no-data-card.component';

@Component({
  selector: 'app-suggested-job-post-card',
  standalone: true,
  imports: [
    CommonModule,
    JobPostComponent,
    NoDataCardComponent,
  ],
  templateUrl: './suggested-job-post-card.component.html',
  styleUrls: ['./suggested-job-post-card.component.css'],
})
export class SuggestedJobPostCardComponent implements OnInit {
  @Input() pageSize: number = 12;
  @Input() mode: 'fixed' | 'responsive' = 'responsive';

  jobPosts: any[] = [];
  isLoading: boolean = true;
  page: number = 1;
  count: number = 0;
  totalPages: number = 0;
  col: number = 3;
  cityDict: { [key: string]: string } | null = null;

  constructor(
    private jobService: JobService,
    private commonService: CommonService,
    private authService: AuthStateService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.handleResize();
    this.getConfigs();
    this.loadJobs();
  }

  getConfigs() {
    this.commonService.getConfigs().subscribe({
      next: (res) => {
        this.cityDict = res.data.cityDict;
      },
      error: () => {
        this.toastr.error('Không thể tải cấu hình thành phố');
      },
    });
  }

  loadJobs() {
    const currentUser = this.authService.getCurrentUser();
    const isAuthenticated = this.authService.isAuthenticated();

    if (!isAuthenticated || currentUser?.roleName !== ROLES_NAME.JOB_SEEKER) {
      this.isLoading = false;
      this.jobPosts = [];
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
          this.count = res.data.count;
          this.totalPages = Math.ceil(this.count / this.pageSize);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading jobs:', err);
          this.toastr.error('Không thể tải danh sách công việc');
          this.isLoading = false;
          this.jobPosts = [];
        },
      });
  }

  @HostListener('window:resize')
  handleResize() {
    if (this.mode === 'fixed') {
      this.col = 1; // Luôn 1 cột cho mode fixed
      return;
    }
    const width = window.innerWidth;
    if (width < 900) {
      this.col = 1;
    } else if (width < 1200) {
      this.col = 2;
    } else {
      this.col = 3;
    }
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.loadJobs();
    }
  }

  getVisiblePages(): number[] {
    const maxVisiblePages = 5;
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, this.page - half);
    let end = Math.min(this.totalPages, start + maxVisiblePages - 1);
    start = Math.max(1, end - maxVisiblePages + 1);

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  getCityName(cityId: number): string {
    return this.cityDict?.[Number(cityId)] || '--';
  }
}

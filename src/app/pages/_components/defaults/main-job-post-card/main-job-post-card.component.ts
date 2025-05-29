import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '../../../../_services/job.service';
import { Subject, takeUntil } from 'rxjs';
import { JobPostLargeComponent } from '../../../../_components/job-post-large/job-post-large.component';
import { NoDataCardComponent } from '../../../../_components/no-data-card/no-data-card.component';

@Component({
  selector: 'app-main-job-post-card',
  standalone: true,
  imports: [
    CommonModule,
    JobPostLargeComponent,
    NoDataCardComponent
  ],
  templateUrl: './main-job-post-card.component.html',
  styleUrls: ['./main-job-post-card.component.css']
})
export class MainJobPostCardComponent implements OnInit, OnDestroy {
  isLoading = true;
  jobPosts: any[] = [];
  page: number = 1;
  count: number = 0;
  totalPages: number = 0;
  pageSize = 10;
  destroy$ = new Subject<void>();
  jobPostFilter: any = {};

  constructor(
    private jobService: JobService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.jobPostFilter = {
        kw: params['kw'] || '',
        careerId: params['careerId'] || '',
        cityId: params['cityId'] || '',
        positionId: params['positionId'] || '',
        experienceId: params['experienceId'] || '',
        jobTypeId: params['jobTypeId'] || '',
        typeOfWorkplaceId: params['typeOfWorkplaceId'] || '',
        genderId: params['genderId'] || ''
      };
      this.page = 1;
      this.getJobPosts();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getJobPosts() {
    this.isLoading = true;
    this.jobService.getJobPosts({ ...this.jobPostFilter, page: this.page })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.count = res.data?.count || 0;
          this.jobPosts = res.data?.results || [];
          this.totalPages = this.pageCount;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      });
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.getJobPosts();
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

  get pageCount(): number {
    return Math.ceil(this.count / this.pageSize);
  }
}

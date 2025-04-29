import { Component } from '@angular/core';
import { JobService } from '../../../../_services/job.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JobPostLargeComponent } from "../../../../_components/job-post-large/job-post-large.component";
import { NoDataCardComponent } from "../../../../_components/no-data-card/no-data-card.component";

@Component({
  selector: 'app-main-job-post-card',
  imports: [
    CommonModule,
    JobPostLargeComponent,
    NoDataCardComponent
],
  templateUrl: './main-job-post-card.component.html',
  styleUrl: './main-job-post-card.component.css'
})
export class MainJobPostCardComponent {
  isLoading = true;
  jobPosts: any[] = [];
  page = 1;
  count = 0;
  pageSize = 10;
  destroy$ = new Subject<void>();

  constructor(private jobService: JobService) {}

  ngOnInit() {
    this.loadJobPosts();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadJobPosts() {
    this.isLoading = true;
    const jobPostFilter = {}; // 🔥 bạn cần lấy từ service lưu trạng thái filter hoặc để tạm

    this.jobService.getJobPosts({ ...jobPostFilter, page: this.page })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.count = res.data?.count || 0;
          this.jobPosts = res.data?.results || [];
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      });
  }

  handleChangePage(newPage: number) {
    this.page = newPage;
    this.loadJobPosts();
  }

  get pageCount(): number {
    return Math.ceil(this.count / this.pageSize);
  }
}

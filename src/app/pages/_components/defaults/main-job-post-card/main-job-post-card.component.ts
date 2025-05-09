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
  page: number = 1;
  count: number = 0;
  totalPages: number = 0;
  pageSize = 10;
  destroy$ = new Subject<void>();

  constructor(private jobService: JobService) {}

  ngOnInit() {
    this.getJobPosts();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getJobPosts() {
    this.isLoading = true;
    const jobPostFilter = {}; // 🔥 bạn cần lấy từ service lưu trạng thái filter hoặc để tạm

    this.jobService.getJobPosts({ ...jobPostFilter, page: this.page })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.count = res.data?.count || 0;
          this.jobPosts = res.data?.results || [];
          this.totalPages = this.pageCount; // Gán totalPages từ pageCount
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
    const maxVisiblePages = 5; // Số trang tối đa hiển thị (VD: 1, 2, 3, 4, 5)
    const half = Math.floor(maxVisiblePages / 2); // Số trang hiển thị trước/sau trang hiện tại
    let start = Math.max(1, this.page - half);
    let end = Math.min(this.totalPages, start + maxVisiblePages - 1);

    // Điều chỉnh start nếu end đạt giới hạn
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

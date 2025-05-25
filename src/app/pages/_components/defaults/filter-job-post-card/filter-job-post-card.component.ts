import { Component, HostListener, Input, OnInit } from '@angular/core';
import { JobService } from '../../../../_services/job.service';
import { CommonModule } from '@angular/common';
import { NoDataCardComponent } from "../../../../_components/no-data-card/no-data-card.component";
import { JobPostComponent } from "../../../../_components/job-post/job-post.component";

@Component({
  selector: 'app-filter-job-post-card',
  imports: [
    CommonModule,
    NoDataCardComponent,
    JobPostComponent
  ],
  templateUrl: './filter-job-post-card.component.html',
  styleUrl: './filter-job-post-card.component.css'
})
export class FilterJobPostCardComponent implements OnInit {
  @Input() params: any = {};
  @Input() mode: 'fixed' | 'responsive' = 'responsive'; // 'fixed' cho 1 cột, 'responsive' cho 3/2/1 cột

  jobPosts: any[] = [];
  isLoading: boolean = true;
  page: number = 1;
  count: number = 0;
  totalPages: number = 0;
  col: number = 3; // Mặc định cho responsive
  readonly pageSize = 12;

  constructor(private jobService: JobService) {}

  ngOnInit() {
    this.handleResize();
    this.getJobPosts();
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

  getJobPosts() {
    this.isLoading = true;
    this.jobService.getJobPosts({
      ...this.params,
      pageSize: this.pageSize,
      page: this.page
    }).subscribe({
      next: (res) => {
        const data = res.data;
        this.count = data.count;
        this.totalPages = Math.ceil(this.count / this.pageSize);
        this.jobPosts = data.results || [];
      },
      error: (err) => {
        console.error('Lỗi lấy job posts:', err);
      },
      complete: () => {
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
}

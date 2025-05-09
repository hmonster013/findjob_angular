import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { formatDate } from '@angular/common';
import { JobPostActivityService } from '../../../../_services/job-post-activity.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-applied-job-card',
  standalone: true,
  templateUrl: './applied-job-card.component.html',
  styleUrls: ['./applied-job-card.component.css'],
  imports: [CommonModule, RouterModule],
})
export class AppliedJobCardComponent implements OnInit {
  jobPostsApplied: any[] = [];
  isLoading = true;
  page = 1;
  pageSize = 10;
  count = 0;

  constructor(
    private jobPostActivityService: JobPostActivityService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadJobPostActivities();
  }

  loadJobPostActivities() {
    this.isLoading = true;
    this.jobPostActivityService.getJobPostActivity({ page: this.page, pageSize: this.pageSize }).subscribe({
      next: (res) => {
        this.jobPostsApplied = res.data?.results || [];
        this.count = res.data?.count || 0;
      },
      error: (err) => {
        console.error('Error fetching job post activities:', err);
        this.toastr.error('Không thể tải danh sách công việc đã ứng tuyển!');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  formatDateDisplay(dateStr: string): string {
    return formatDate(dateStr, 'dd/MM/yyyy', 'en-US');
  }

  handleChangePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.loadJobPostActivities();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.count / this.pageSize);
  }

  get pages(): number[] {
    const total = this.totalPages;
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(total, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
}

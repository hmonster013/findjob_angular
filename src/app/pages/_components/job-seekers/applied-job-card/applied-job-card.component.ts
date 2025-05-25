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

  // Ánh xạ city ID sang tên thành phố (giả định, đồng bộ với SavedJobCard)
  private cityMap: { [key: number]: string } = {
    1: 'Hà Nội',
    2: 'TP. Hồ Chí Minh',
    3: 'Đà Nẵng',
    // Thêm các thành phố khác nếu cần
  };

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
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  formatDateDisplay(dateStr: string): string {
    return formatDate(dateStr, 'dd/MM/yyyy', 'en-US');
  }

  // Hàm ánh xạ city ID sang tên thành phố
  getCityName(cityId?: number): string {
    return cityId && this.cityMap[cityId] ? this.cityMap[cityId] : 'Không xác định';
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

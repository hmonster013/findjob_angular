import { CommonService } from './../../../../_services/common.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { JobService } from '../../../../_services/job.service';
import { IMAGES } from '../../../../_configs/constants';

@Component({
  selector: 'app-saved-job-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './saved-job-card.component.html',
  styleUrls: ['./saved-job-card.component.css'],
})
export class SavedJobCardComponent implements OnInit {
  savedJobs: any[] = [];
  isLoading = true;
  page = 1;
  pageSize = 5;
  count = 0;
  cityOptions: any[] = [];

  IMAGES = IMAGES;

  constructor(
    private jobService: JobService,
    private toastr: ToastrService,
    private commonService: CommonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCities();
    this.loadSavedJobs();
  }

  getCities() {
    this.commonService.getCities().subscribe({
      next: (res) => {
        this.cityOptions = res.data;
      },
      error: (err) => {
        console.error('Error loading cities:', err);
      }
    });
  }

  // Hàm mới để lấy tên thành phố từ id
  getCityNameById(cityId: number): string {
    const city = this.cityOptions.find((c) => c.id === cityId);
    return city ? city.name : 'Không xác định';
  }

  loadSavedJobs() {
    this.isLoading = true;
    const params = {
      page: this.page,
      pageSize: this.pageSize
    };
    this.jobService.getJobPostsSaved(params).subscribe({
      next: (res) => {
        this.savedJobs = res.data?.results || [];
        this.count = res.data?.count || 0;
      },
      error: (err) => {
        console.error('Error loading saved jobs:', err);
        this.toastr.error('Không thể tải danh sách công việc đã lưu!');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  handleUnsave(slug: string) {
    Swal.fire({
      title: 'Xác nhận',
      text: 'Bạn có chắc chắn muốn hủy lưu công việc này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Hủy lưu',
      cancelButtonText: 'Giữ lại'
    }).then((result) => {
      if (result.isConfirmed) {
        this.jobService.saveJobPost(slug).subscribe({
          next: () => {
            this.toastr.success('Đã hủy lưu công việc thành công!');
            this.loadSavedJobs();
          },
          error: (err) => {
            console.error('Error unsaving job:', err);
            this.toastr.error('Không thể hủy lưu công việc!');
          }
        });
      }
    });
  }

  handleChangePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.loadSavedJobs();
    }
  }

  public navigateToJob(slug: string) {
    this.router.navigate(['/jobs', slug]);
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

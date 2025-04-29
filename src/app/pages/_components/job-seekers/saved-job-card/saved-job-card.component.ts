import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { JobService } from '../../../../_services/job.service';

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

  constructor(
    private jobService: JobService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSavedJobs();
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
          }
        });
      }
    });
  }

  handleChangePage(newPage: number) {
    this.page = newPage;
    this.loadSavedJobs();
  }

  public navigateToJob(slug: string) {
    this.router.navigate(['/jobs', slug]);
  }

  get totalPages(): number {
    return Math.ceil(this.count / this.pageSize);
  }
}

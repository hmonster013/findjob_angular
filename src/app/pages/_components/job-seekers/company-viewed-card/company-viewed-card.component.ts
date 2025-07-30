import { IMAGES } from './../../../../_configs/constants';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ResumeViewedService } from '../../../../_services/resume-viewed.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-company-viewed-card',
  standalone: true,
  templateUrl: './company-viewed-card.component.html',
  styleUrls: ['./company-viewed-card.component.css'],
  imports: [CommonModule, RouterModule],
})
export class CompanyViewedCardComponent implements OnInit {
  companiesViewed: any[] = [];
  isLoading = true;
  page = 1;
  pageSize = 10;
  count = 0;

  IMAGES = IMAGES;

  constructor(
    private resumeViewedService: ResumeViewedService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCompaniesViewed();
  }

  loadCompaniesViewed() {
    this.isLoading = true;
    this.resumeViewedService.getResumeViewed({ page: this.page, pageSize: this.pageSize }).subscribe({
      next: (res) => {
        this.companiesViewed = res.data?.results || [];
        this.count = res.data?.count || 0;
      },
      error: (err) => {
        console.error('Error fetching companies viewed:', err);
        this.toastr.error('Không thể tải danh sách công ty đã xem hồ sơ!');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  handleChangePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.loadCompaniesViewed();
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

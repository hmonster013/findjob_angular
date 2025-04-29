import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ResumeViewedService } from '../../../../_services/resume-viewed.service';

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

  constructor(
    private resumeViewedService: ResumeViewedService
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
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  handleChangePage(newPage: number) {
    this.page = newPage;
    this.loadCompaniesViewed();
  }

  get totalPages(): number {
    return Math.ceil(this.count / this.pageSize);
  }
}

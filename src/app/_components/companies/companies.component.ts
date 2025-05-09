import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CompanyService } from '../../_services/company.service';
import { CompanyComponent } from "../company/company.component";
import { NoDataCardComponent } from "../no-data-card/no-data-card.component";

@Component({
  selector: 'app-companies',
  imports: [
    CommonModule,
    CompanyComponent,
    NoDataCardComponent
],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css'
})
export class CompaniesComponent {
  isLoading = true;
  companies: any[] = [];
  page = 1;
  count = 0;
  pageSize = 12;
  skeletonArray = Array(12);

  constructor(private companyService: CompanyService) {}

  ngOnInit() {
    this.fetchCompanies();
  }

  fetchCompanies() {
    this.isLoading = true;
    this.companyService.getCompanies({ page: this.page, pageSize: this.pageSize }).subscribe({
      next: (res) => {
        const data = res.data;
        this.count = data.count;
        this.companies = data.results || [];
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.fetchCompanies();
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

  get totalPages() {
    return Math.ceil(this.count / this.pageSize);
  }
}

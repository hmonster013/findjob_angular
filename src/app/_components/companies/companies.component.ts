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

  handleChangePage(newPage: number) {
    this.page = newPage;
    this.fetchCompanies();
  }

  get totalPages() {
    return Math.ceil(this.count / this.pageSize);
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CompanyService } from '../../_services/company.service';
import { CommonService } from '../../_services/common.service';
import { CompanyComponent } from '../company/company.component';
import { NoDataCardComponent } from '../no-data-card/no-data-card.component';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [
    CommonModule,
    CompanyComponent,
    NoDataCardComponent
  ],
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit, OnDestroy {
  isLoading = true;
  companies: any[] = [];
  page = 1;
  count = 0;
  pageSize = 12;
  destroy$ = new Subject<void>();
  searchParams: any = {};
  skeletonArray = Array(12);

  cityDict: { [key: string]: string } | null = null;
  employeeSizeDict: { [key: string]: string } | null = null;

  constructor(
    private companyService: CompanyService,
    private commonService: CommonService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getConfigs();
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.searchParams = {
        kw: params['kw'] || '',
        cityId: params['cityId'] || '',
        fieldId: params['fieldId'] || ''
      };
      this.page = 1;
      this.fetchCompanies();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getConfigs() {
    this.commonService.getConfigs().subscribe({
      next: (res) => {
        this.cityDict = res.data.cityDict || {};
        this.employeeSizeDict = res.data.employeeSizeDict || {};
      },
      error: (err) => {
        console.error('Lỗi tải cấu hình:', err);
      }
    });
  }

  fetchCompanies() {
    this.isLoading = true;
    const params = {
      page: this.page,
      pageSize: this.pageSize,
      ...this.searchParams
    };
    this.companyService.getCompanies(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const data = res.data;
          this.count = data.count || 0;
          this.companies = data.results || [];
        },
        error: (err) => {
          console.error('Lỗi tải danh sách công ty:', err);
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

  get totalPages() {
    return Math.ceil(this.count / this.pageSize);
  }

  getCityName(cityId: number): string {
    return this.cityDict?.[cityId] || 'Chưa cập nhật';
  }

  getEmployeeSizeName(sizeId: number): string {
    return this.employeeSizeDict?.[sizeId] || 'Chưa cập nhật';
  }
}

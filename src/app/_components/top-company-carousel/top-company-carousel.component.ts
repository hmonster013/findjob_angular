import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, OnInit } from '@angular/core';
import { CompanyService } from '../../_services/company.service';
import { Router, RouterLink } from '@angular/router';
import { IMAGES, ROUTES } from '../../_configs/constants';

@Component({
  selector: 'app-top-company-carousel',
  imports: [
    CommonModule
  ],
  templateUrl: './top-company-carousel.component.html',
  styleUrl: './top-company-carousel.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TopCompanyCarouselComponent implements OnInit {
  companies: any[] = [];
  isLoading: boolean = true;
  skeletonArray = Array(10);
  col: number = 5;

  IMAGES = IMAGES;

  constructor(
    private router: Router,
    private companyService: CompanyService,
  ) {
  }

  ngOnInit() {
    this.fetchCompanies();
    this.calculateColumns();
  }

  fetchCompanies() {
    this.isLoading = true;
    this.companyService.getTopCompanies().subscribe({
      next: (res) => {
        this.companies = res.data || [];
      },
      error: (err) => {
        console.error('Lỗi lấy danh sách công ty:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    this.calculateColumns();
  }

  calculateColumns() {
    const width = window.innerWidth;
    if (width < 600) {
      this.col = 2;
    } else if (width < 900) {
      this.col = 3;
    } else if (width < 1200) {
      this.col = 4;
    } else {
      this.col = 5;
    }
  }

  navigateToCompany(slug: string) {
    const url = ROUTES.JOB_SEEKER.COMPANY_DETAIL.replace(':slug', slug);
    this.router.navigate([`/${url}`]);
  }
}

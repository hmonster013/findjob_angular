import { IMAGES } from './../../../../_configs/constants';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from '../../../../_services/company.service';
import { CompanyFollowedService } from '../../../../_services/company-followed.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-company-followed-card',
  standalone: true,
  templateUrl: './company-followed-card.component.html',
  styleUrls: ['./company-followed-card.component.css'],
  imports: [CommonModule, RouterModule],
})
export class CompanyFollowedCardComponent implements OnInit {
  companiesFollowed: any[] = [];
  isLoading = true;
  page = 1;
  pageSize = 10;
  count = 0;

  IMAGES = IMAGES;

  constructor(
    private companyFollowedService: CompanyFollowedService,
    private companyService: CompanyService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCompaniesFollowed();
  }

  loadCompaniesFollowed() {
    this.isLoading = true;
    this.companyFollowedService.getCompaniesFollowed({ pageSize: this.pageSize, page: this.page }).subscribe({
      next: (res) => {
        this.companiesFollowed = res.data?.results || [];
        this.count = res.data?.count || 0;
      },
      error: (err) => {
        console.error('Error fetching companies followed:', err);
        this.toastr.error('Không thể tải danh sách công ty đã theo dõi!');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  handleUnfollow(slug: string) {
    // TODO: Kiểm tra xem API có endpoint unfollowCompany riêng không, hiện dùng followCompany có thể sai
    this.companyService.followCompany(slug).subscribe({
      next: () => {
        this.toastr.success('Hủy theo dõi thành công!');
        this.loadCompaniesFollowed();
      },
      error: (err) => {
        console.error('Unfollow error:', err);
        this.toastr.error('Không thể hủy theo dõi công ty!');
      }
    });
  }

  handleChangePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.loadCompaniesFollowed();
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from '../../../../_services/company.service';
import { CompanyFollowedService } from '../../../../_services/company-followed.service';

@Component({
  selector: 'app-company-followed-card',
  standalone: true,
  templateUrl: './company-followed-card.component.html',
  styleUrls: ['./company-followed-card.component.css'],
  imports: [CommonModule],
})
export class CompanyFollowedCardComponent implements OnInit {
  companiesFollowed: any[] = [];
  isLoading = true;
  page = 1;
  pageSize = 10;
  count = 0;

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
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  handleUnfollow(slug: string) {
    this.companyService.followCompany(slug).subscribe({
      next: () => {
        this.toastr.success('Hủy theo dõi thành công!');
        this.loadCompaniesFollowed();
      },
      error: (err) => {
        console.error('Unfollow error:', err);
      }
    });
  }

  handleChangePage(newPage: number) {
    this.page = newPage;
    this.loadCompaniesFollowed();
  }

  get totalPages(): number {
    return Math.ceil(this.count / this.pageSize);
  }
}

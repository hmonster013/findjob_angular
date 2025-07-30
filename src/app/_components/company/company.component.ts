import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
import { CompanyService } from '../../_services/company.service';
import { AuthStateService } from '../../_services/auth-state.service';
import { RouterLink } from '@angular/router';
import { IMAGES } from '../../_configs/constants';

@Component({
  selector: 'app-company',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent {
  @Input() slug!: string;
  @Input() companyImageUrl!: string;
  @Input() companyCoverImageUrl!: string;
  @Input() companyName!: string;
  @Input() fieldOperation!: string;
  @Input() city!: string;
  @Input() employeeSize!: string;
  @Input() followNumber: number = 0;
  @Input() jobPostNumber: number = 0;
  @Input() isFollowed: boolean = false;
  @Input() isLoading: boolean = false;

  followed: boolean = false;
  loadingFollow: boolean = false;

  IMAGES = IMAGES;

  constructor(
    private companyService: CompanyService,
    private authStateService: AuthStateService
  ) {}

  ngOnInit() {
    this.followed = this.isFollowed;
  }

  get cityName() {
    return this.city || 'Chưa cập nhật';
  }

  get employeeSizeName() {
    return this.employeeSize || 'Chưa cập nhật';
  }

  get isJobSeeker() {
    const user = this.authStateService.getCurrentUser();
    return user?.roleName === 'JobSeeker';
  }

  async handleFollow() {
    if (!this.slug) return;
    this.loadingFollow = true;

    this.companyService.followCompany(this.slug).subscribe({
      next: (res) => {
        this.followed = res.data?.isFollowed ?? this.followed;
      },
      error: (err) => {
        console.error('Lỗi follow:', err);
      },
      complete: () => {
        this.loadingFollow = false;
      }
    });
  }
}

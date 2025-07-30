import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AccountCardComponent } from '../../_components/auths/account-card/account-card.component';
import { AuthenticationService } from '../../../_services/authentication.service';
import { AuthStateService } from '../../../_services/auth-state.service';

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
}

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    AccountCardComponent,
  ]
})
export class AccountPageComponent implements OnInit {
  userProfile: UserProfile | null = null;
  isLoading: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private authStateService: AuthStateService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchUserProfile();
  }

  fetchUserProfile(): void {
    this.isLoading = true;
    this.authService.getUserInfo().subscribe({
      next: (res) => {
        this.userProfile = res.data; // Giả định API trả về { data: UserProfile }
        this.authStateService.setCurrentUser(res.data); // Lưu vào localStorage
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.toastr.error('Không thể tải thông tin tài khoản');
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  logout(): void {
    const user = this.authStateService.getCurrentUser();
    if (user && user.access_token) {
      this.authService.revokeToken(user.access_token, 'password').subscribe({
        next: () => {
          this.authStateService.clearUser();
          this.toastr.success('Đăng xuất thành công');
          this.router.navigate(['/login']);
        },
        error: () => {
          this.toastr.error('Đăng xuất thất bại');
        }
      });
    } else {
      this.authStateService.clearUser();
      this.router.navigate(['/login']);
    }
  }
}

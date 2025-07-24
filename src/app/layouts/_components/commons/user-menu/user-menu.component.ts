import { Component, EventEmitter, Output, ElementRef, HostListener } from '@angular/core';
import { AuthStateService } from '../../../../_services/auth-state.service';
import { Router, RouterLink } from '@angular/router';
import { ROLES_NAME, ROUTES } from '../../../../_configs/constants';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { TokenService } from '../../../../_services/token.service';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css']
})
export class UserMenuComponent {
  @Output() closed = new EventEmitter<void>();

  menuItems: { label: string; path: string }[] = [];
  currentUser: any;

  private jobSeekerMenu = [
    { label: 'Quản lý tài khoản', path: ROUTES.JOB_SEEKER.DASHBOARD },
  ];

  private employerMenu = [
    { label: 'Trang quản lý NTD', path: ROUTES.EMPLOYER.DASHBOARD },
  ];

  constructor(
    private authService: AuthStateService,
    private router: Router,
    private tokenService: TokenService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.menuItems =
      this.currentUser?.roleName === ROLES_NAME.JOB_SEEKER
        ? this.jobSeekerMenu
        : this.currentUser?.roleName === ROLES_NAME.EMPLOYER
        ? this.employerMenu
        : [];
  }

  closeMenu(): void {
    this.closed.emit();
  }

  handleLogout(): void {
    this.closeMenu();
    Swal.fire({
      title: 'Đăng xuất tài khoản',
      text: 'Bạn có chắc chắn muốn đăng xuất?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Có, đăng xuất!',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.clearUser();
        this.tokenService.removeAccessTokenAndRefreshTokenFromCookie();
        this.router.navigate([`/${ROUTES.AUTH.LOGIN}`]);
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeMenu();
    }
  }
}

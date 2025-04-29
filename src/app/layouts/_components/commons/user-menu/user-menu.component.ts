import { Component, EventEmitter, Output } from '@angular/core';
import { AuthStateService } from '../../../../_services/auth-state.service';
import { Router, RouterLink } from '@angular/router';
import { ROLES_NAME, ROUTES } from '../../../../_configs/constants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-menu',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.css'
})
export class UserMenuComponent {
  currentUser: any;
  isOpen: boolean = false;

  @Output() closed = new EventEmitter<void>();

  constructor(
    private authStateService: AuthStateService,
    private router: Router,
  ) {
    this.currentUser = this.authStateService.getCurrentUser();
  }

  get menuItems() {
    if (!this.currentUser) return [];

    if (this.currentUser.roleName === ROLES_NAME.JOB_SEEKER) {
      return [
        { label: 'Quản lý tài khoản', path: ROUTES.JOB_SEEKER.DASHBOARD },
      ];
    } else if (this.currentUser.roleName === ROLES_NAME.EMPLOYER) {
      return [
        { label: 'Trang quản lý NTD', path: ROUTES.EMPLOYER.DASHBOARD },
      ];
    } else {
      return [];
    }
  }

  handleLogout() {
    this.authStateService.clearUser();
    this.router.navigate([`/${ROUTES.AUTH.LOGIN}`]);
  }

  closeMenu() {
    this.isOpen = false;
    this.closed.emit();
  }
}

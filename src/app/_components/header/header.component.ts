import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthStateService } from '../../_services/auth-state.service';
import { HOST_NAME, ROUTES } from '../../_configs/constants';
import { UserMenuComponent } from "../user-menu/user-menu.component";
import { AccountSwitchMenuComponent } from "../account-switch-menu/account-switch-menu.component";
import { LeftDrawerComponent } from "../left-drawer/left-drawer.component";
import { NotificationCardComponent } from "../notification-card/notification-card.component";
import { ChatCardComponent } from "../chat-card/chat-card.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    UserMenuComponent,
    AccountSwitchMenuComponent,
    LeftDrawerComponent,
    NotificationCardComponent,
    ChatCardComponent,
    CommonModule,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isAuthenticated = false;
  currentUser: any;
  pages: any;
  mobileOpen = false;
  openUserMenu = false;

  constructor(private router: Router,
              private authStateService: AuthStateService) {
    this.authStateService.getAuthStatus().subscribe(status => {
      this.isAuthenticated = status;
      this.currentUser = this.authStateService.getCurrentUser();
    });
    this.setupPages();
  }

  setupPages() {
    const hostname = window.location.hostname;
    if (hostname === HOST_NAME.MYJOB) {
      this.pages = [
        { id: 1, label: 'Việc làm', path: `/${ROUTES.JOB_SEEKER.JOBS}` },
        { id: 2, label: 'Công ty', path: `/${ROUTES.JOB_SEEKER.COMPANY}` },
        { id: 3, label: 'Về chúng tôi', path: `/${ROUTES.JOB_SEEKER.ABOUT_US}` },
      ];
    } else {
      this.pages = [
        { id: 1, label: 'Giới thiệu', path: `/${ROUTES.EMPLOYER.INTRODUCE}` },
        { id: 2, label: 'Dịch vụ', path: `/${ROUTES.EMPLOYER.SERVICE}` },
        { id: 3, label: 'Báo giá', path: `/${ROUTES.EMPLOYER.PRICING}` },
        { id: 4, label: 'Hỗ trợ', path: `/${ROUTES.EMPLOYER.SUPPORT}` },
        { id: 5, label: 'Blog tuyển dụng', path: `/${ROUTES.EMPLOYER.BLOG}` },
      ];
    }
  }

  navigateToLogin() {
    this.router.navigate([`/${ROUTES.AUTH.LOGIN}`]);
  }

  navigateToRegister() {
    this.router.navigate([`/${ROUTES.AUTH.REGISTER}`]);
  }

  toggleMobileMenu() {
    this.mobileOpen = !this.mobileOpen;
  }

  toggleUserMenu() {
    this.openUserMenu = !this.openUserMenu;
  }

  closeUserMenu() {
    this.openUserMenu = false;
  }

  isActive(path: string): boolean {
    return this.router.url.startsWith(path);
  }
}

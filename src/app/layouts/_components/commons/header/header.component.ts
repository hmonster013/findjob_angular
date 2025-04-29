import { Component } from '@angular/core';
import { HOST_NAME, ROUTES } from '../../../../_configs/constants';
import { AuthStateService } from '../../../../_services/auth-state.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountSwitchMenuComponent } from "../account-switch-menu/account-switch-menu.component";
import { LeftDrawerComponent } from "../../../../_components/left-drawer/left-drawer.component";
import { NotificationCardComponent } from "../../../../_components/notification-card/notification-card.component";
import { ChatCardComponent } from "../../../../_components/chat-card/chat-card.component";

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterLink,
    AccountSwitchMenuComponent,
    LeftDrawerComponent,
    NotificationCardComponent,
    ChatCardComponent
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  mobileOpen: boolean = false;
  currentUser: any;
  isAuthenticated: boolean = false;

  hostName = window.location.hostname;
  pages = {
    [HOST_NAME.MYJOB]: [
      { id: 1, label: 'Việc làm', path: `/${ROUTES.JOB_SEEKER.JOBS}` },
      { id: 2, label: 'Công ty', path: `/${ROUTES.JOB_SEEKER.COMPANY}` },
      { id: 3, label: 'Về chúng tôi', path: `/${ROUTES.JOB_SEEKER.ABOUT_US}` },
    ],
    [HOST_NAME.EMPLOYER_MYJOB]: [
      { id: 1, label: 'Giới thiệu', path: `/${ROUTES.EMPLOYER.INTRODUCE}` },
      { id: 2, label: 'Dịch vụ', path: `/${ROUTES.EMPLOYER.SERVICE}` },
      { id: 3, label: 'Báo giá', path: `/${ROUTES.EMPLOYER.PRICING}` },
      { id: 4, label: 'Hỗ trợ', path: `/${ROUTES.EMPLOYER.SUPPORT}` },
      { id: 5, label: 'Blog tuyển dụng', path: `/${ROUTES.EMPLOYER.BLOG}` },
    ]
  };

  constructor(
    private authStateService: AuthStateService,
    private router: Router
  ) {
    this.currentUser = this.authStateService.getCurrentUser();
    this.isAuthenticated = !!this.currentUser;
  }

  handleDrawerToggle() {
    this.mobileOpen = !this.mobileOpen;
  }

  handleLogin() {
    this.router.navigate([`/${ROUTES.AUTH.LOGIN}`]);
  }

  handleSignUp() {
    this.router.navigate([`/${ROUTES.AUTH.REGISTER}`]);
  }
}

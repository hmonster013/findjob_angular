import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthStateService } from '../../../../_services/auth-state.service';
import { Router, RouterLink } from '@angular/router';
import { ROUTES } from '../../../../_configs/constants';
import { CommonModule } from '@angular/common';
import { confirmModal } from '../../../../_utils/sweetalert2-modal';
import { AccountSwitchMenuComponent } from "../account-switch-menu/account-switch-menu.component";

@Component({
  selector: 'app-left-drawer',
  imports: [
    CommonModule,
    RouterLink,
    AccountSwitchMenuComponent
],
  templateUrl: './left-drawer.component.html',
  styleUrl: './left-drawer.component.css'
})
export class LeftDrawerComponent {
  @Input() pages: any[] = [];
  @Input() mobileOpen: boolean = false;
  @Output() closeDrawer = new EventEmitter<void>();

  drawerWidth: number = 240;
  isAuthenticated: boolean = false;
  currentUser: any;

  constructor(
    private authStateService: AuthStateService,
    private router: Router
  ) {
    this.currentUser = this.authStateService.getCurrentUser();
    this.isAuthenticated = !!this.currentUser;
  }

  handleLogout() {
    this.authStateService.clearUser();
    this.router.navigate([`/${ROUTES.AUTH.LOGIN}`]);
  }

  handleLogoutConfirm() {
    confirmModal(
      () => this.handleLogout(),
      'Đăng xuất tài khoản',
      'Bạn có chắc chắn muốn đăng xuất?',
      'question'
    );
  }

  handleRegister() {
    this.router.navigate([`/${ROUTES.AUTH.REGISTER}`]);
  }

  onClickOutside() {
    this.closeDrawer.emit();
  }
}

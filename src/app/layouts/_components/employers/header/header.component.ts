import { Component, HostListener, Input } from '@angular/core';
import { AuthStateService } from '../../../../_services/auth-state.service';
import { AccountSwitchMenuComponent } from "../../../../_components/account-switch-menu/account-switch-menu.component";
import { NotificationCardComponent } from "../../../../_components/notification-card/notification-card.component";
import { ChatCardComponent } from "../../../../_components/chat-card/chat-card.component";
import { CommonModule } from '@angular/common';
import { UserMenuComponent } from "../../commons/user-menu/user-menu.component";

@Component({
  selector: 'app-header',
  imports: [
    AccountSwitchMenuComponent,
    NotificationCardComponent,
    ChatCardComponent,
    CommonModule,
    UserMenuComponent
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() drawerWidth: number = 280;
  @Input() handleDrawerToggle?: () => void;

  currentUser: any = null;
  isAuthenticated: boolean = false;
  showUserMenu: boolean = false;

  constructor(private authStateService: AuthStateService) {}

  ngOnInit() {
    this.currentUser = this.authStateService.getCurrentUser();
    this.isAuthenticated = !!this.currentUser;
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  closeUserMenu() {
    this.showUserMenu = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-wrapper')) {
      this.closeUserMenu();
    }
  }

  get headerWidth() {
    return `calc(100% - ${this.drawerWidth}px)`;
  }

  get headerMarginLeft() {
    return `${this.drawerWidth}px`;
  }
}

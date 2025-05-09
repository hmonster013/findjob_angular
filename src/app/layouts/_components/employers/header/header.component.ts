import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStateService } from '../../../../_services/auth-state.service';
import { NotificationCardComponent } from '../../../../_components/notification-card/notification-card.component';
import { ChatCardComponent } from '../../../../_components/chat-card/chat-card.component';
import { UserMenuComponent } from '../../commons/user-menu/user-menu.component';
import { AccountSwitchMenuComponent } from '../../commons/account-switch-menu/account-switch-menu.component';
import { Subject, fromEvent, takeUntil } from 'rxjs';

/**
 * Header component for the application, displaying navigation and user-related actions.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    NotificationCardComponent,
    ChatCardComponent,
    UserMenuComponent,
    AccountSwitchMenuComponent
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {
  /** Width of the sidebar drawer */
  @Input() drawerWidth: number = 200;
  /** Function to toggle the sidebar drawer */
  @Input() handleDrawerToggle?: () => void;

  /** Current authenticated user */
  currentUser: any = null;
  /** Authentication status */
  isAuthenticated: boolean = false;
  /** Visibility state of the user menu */
  showUserMenu: boolean = false;
  /** Visibility state of the notification menu */
  showNotificationMenu: boolean = false;
  /** Subject to manage subscription cleanup */
  private destroy$ = new Subject<void>();

  constructor(
    private authStateService: AuthStateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authStateService.getAuthStatus().pipe(
      takeUntil(this.destroy$)
    ).subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      this.currentUser = isAuthenticated ? this.authStateService.getCurrentUser() : null;
      this.cdr.markForCheck();
    });

    fromEvent(document, 'click').pipe(
      takeUntil(this.destroy$)
    ).subscribe((event: Event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu-wrapper') && !target.closest('app-notification-card')) {
        this.closeUserMenu();
        this.closeNotificationMenu();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Toggles the visibility of the user menu and closes the notification menu if open.
   */
  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    if (this.showUserMenu) {
      this.closeNotificationMenu();
    }
    this.cdr.markForCheck();
  }

  /**
   * Closes the user menu.
   */
  closeUserMenu() {
    this.showUserMenu = false;
    this.cdr.markForCheck();
  }

  /**
   * Closes the notification menu.
   */
  closeNotificationMenu() {
    this.showNotificationMenu = false;
    this.cdr.markForCheck();
  }
}

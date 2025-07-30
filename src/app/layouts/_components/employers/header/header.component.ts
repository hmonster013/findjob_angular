import { IMAGES } from './../../../../_configs/constants';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStateService } from '../../../../_services/auth-state.service';
import { NotificationCardComponent } from '../../../../_components/notification-card/notification-card.component';
import { ChatCardComponent } from '../../../../_components/chat-card/chat-card.component';
import { UserMenuComponent } from '../../commons/user-menu/user-menu.component';
import { Subject, fromEvent, takeUntil, debounceTime } from 'rxjs';
import { AccountSwitchMenuComponent } from "../../commons/account-switch-menu/account-switch-menu.component";

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() drawerWidth: number = 240;
  @Input() handleDrawerToggle?: () => void;

  currentUser: any = null;
  isAuthenticated: boolean = false;
  showUserMenu: boolean = false;
  isMobile: boolean = window.innerWidth < 768;
  private destroy$ = new Subject<void>();

  IMAGES = IMAGES;

  constructor(
    private authStateService: AuthStateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authStateService.getAuthStatus().pipe(takeUntil(this.destroy$)).subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
      this.currentUser = isAuthenticated ? this.authStateService.getCurrentUser() : null;
      this.cdr.markForCheck();
    });

    fromEvent(window, 'resize')
      .pipe(debounceTime(100), takeUntil(this.destroy$))
      .subscribe(() => {
        this.isMobile = window.innerWidth < 768;
        this.cdr.markForCheck();
      });

    fromEvent(document, 'click')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: Event) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.relative') && !target.closest('app-notification-card')) {
          this.closeMenus();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    this.cdr.markForCheck();
  }

  closeMenus() {
    this.showUserMenu = false;
    this.cdr.markForCheck();
  }
}

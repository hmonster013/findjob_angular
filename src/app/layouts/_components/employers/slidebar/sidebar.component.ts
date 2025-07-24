import { IMAGES } from './../../../../_configs/constants';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { APP_NAME, ROUTES } from '../../../../_configs/constants';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  @Input() isMobile: boolean = false;
  @Input() drawerWidth: number = 240;
  @Input() mobileOpen: boolean = false;
  @Input() handleDrawerToggle?: () => void;

  expandedItems = {
    candidates: false,
    account: false,
  };

  ROUTES = ROUTES;
  APP_NAME = APP_NAME;
  IMAGES = IMAGES;

  toggleExpand(section: 'candidates' | 'account') {
    this.expandedItems[section] = !this.expandedItems[section];
  }
}

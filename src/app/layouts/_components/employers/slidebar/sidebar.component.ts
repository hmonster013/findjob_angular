import { Component, Input } from '@angular/core';
import { APP_NAME, ROUTES } from '../../../../_configs/constants';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() drawerWidth: number = 280;
  @Input() mobileOpen: boolean = false;
  @Input() handleDrawerToggle?: () => void;

  expandedItems = {
    candidates: true,
    account: true,
  };

  ROUTES = ROUTES;
  APP_NAME = APP_NAME;

  toggleExpand(section: 'candidates' | 'account') {
    this.expandedItems[section] = !this.expandedItems[section];
  }
}

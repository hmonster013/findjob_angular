import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../_components/employers/header/header.component';
import { SidebarComponent } from '../_components/employers/slidebar/sidebar.component';

@Component({
  selector: 'app-employer-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent
  ],
  templateUrl: './employer-layout.component.html',
  styleUrls: ['./employer-layout.component.css'],
})
export class EmployerLayoutComponent {
  mobileOpen = false;

  toggleMobileSidebar() {
    this.mobileOpen = !this.mobileOpen;
  }

  closeMobileSidebar() {
    this.mobileOpen = false;
  }
}

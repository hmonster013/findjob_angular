import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-header',
  imports: [
    CommonModule
  ],
  templateUrl: './sidebar-header.component.html',
  styleUrl: './sidebar-header.component.css'
})
export class SidebarHeaderComponent {
  currentUser: any;
  isEmployer: boolean = false;

  constructor(private router: Router) {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.isEmployer = this.currentUser?.roleName === 'Employer';
  }

  handleRedirect() {
    if (this.isEmployer) {
      this.router.navigate(['/employer/dashboard']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}

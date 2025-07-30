import { IMAGES } from './../../../_configs/constants';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '../../../_configs/constants';

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

  IMAGES = IMAGES;

  constructor(private router: Router) {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.isEmployer = this.currentUser?.roleName === 'Employer';
  }

  handleRedirect() {
    if (this.isEmployer) {
      this.router.navigate([ROUTES.EMPLOYER.DASHBOARD]);
    } else {
      this.router.navigate([ROUTES.JOB_SEEKER.HOME]);
    }
  }
}

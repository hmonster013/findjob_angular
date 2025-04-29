import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { APP_NAME, ROUTES } from '../../../../_configs/constants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab-bar',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './tab-bar.component.html',
  styleUrl: './tab-bar.component.css'
})
export class TabBarComponent {
  constructor(private router: Router) {}

  tabItems = [
    { id: 1, label: `My ${APP_NAME}`, path: `/${ROUTES.JOB_SEEKER.DASHBOARD}` },
    { id: 2, label: 'Hồ sơ xin việc', path: `/${ROUTES.JOB_SEEKER.DASHBOARD}/${ROUTES.JOB_SEEKER.PROFILE}` },
    { id: 3, label: 'Việc làm của tôi', path: `/${ROUTES.JOB_SEEKER.DASHBOARD}/${ROUTES.JOB_SEEKER.MY_JOB}` },
    { id: 4, label: 'Công ty của tôi', path: `/${ROUTES.JOB_SEEKER.DASHBOARD}/${ROUTES.JOB_SEEKER.MY_COMPANY}` },
    { id: 5, label: `${APP_NAME} thông báo`, path: `/${ROUTES.JOB_SEEKER.DASHBOARD}/${ROUTES.JOB_SEEKER.NOTIFICATION}` },
    { id: 6, label: 'Tài khoản & cài đặt', path: `/${ROUTES.JOB_SEEKER.DASHBOARD}/${ROUTES.JOB_SEEKER.ACCOUNT}` },
  ];

  navigate(path: string) {
    this.router.navigate([path]);
  }
}

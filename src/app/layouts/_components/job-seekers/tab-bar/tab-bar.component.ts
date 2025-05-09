import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { APP_NAME, ROUTES } from '../../../../_configs/constants';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tab-bar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabBarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  tabItems = [
    { id: 1, label: `My ${APP_NAME}`, icon: 'house', path: `/${ROUTES.JOB_SEEKER.DASHBOARD}` },
    { id: 2, label: 'Hồ sơ xin việc', icon: 'file', path: `/${ROUTES.JOB_SEEKER.DASHBOARD}/${ROUTES.JOB_SEEKER.PROFILE}` },
    { id: 3, label: 'Việc làm của tôi', icon: 'briefcase', path: `/${ROUTES.JOB_SEEKER.DASHBOARD}/${ROUTES.JOB_SEEKER.MY_JOB}` },
    { id: 4, label: 'Công ty của tôi', icon: 'building', path: `/${ROUTES.JOB_SEEKER.DASHBOARD}/${ROUTES.JOB_SEEKER.MY_COMPANY}` },
    { id: 5, label: `${APP_NAME} thông báo`, icon: 'bell', path: `/${ROUTES.JOB_SEEKER.DASHBOARD}/${ROUTES.JOB_SEEKER.NOTIFICATION}` },
    { id: 6, label: 'Tài khoản & cài đặt', icon: 'user-gear', path: `/${ROUTES.JOB_SEEKER.DASHBOARD}/${ROUTES.JOB_SEEKER.ACCOUNT}` },
  ];

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

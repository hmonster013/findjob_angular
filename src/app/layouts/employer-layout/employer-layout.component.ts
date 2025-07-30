import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../_components/employers/header/header.component';
import { fromEvent, Subject, takeUntil, debounceTime } from 'rxjs';
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
export class EmployerLayoutComponent implements OnInit, OnDestroy {
  drawerWidth = 240;
  mobileOpen = false;
  isDesktop = window.innerWidth >= 1024;
  private destroy$ = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    fromEvent(window, 'resize')
      .pipe(debounceTime(100), takeUntil(this.destroy$))
      .subscribe(() => {
        const newIsDesktop = window.innerWidth >= 1024;
        if (newIsDesktop !== this.isDesktop) {
          this.isDesktop = newIsDesktop;
          if (this.isDesktop) {
            this.mobileOpen = false;
          }
          this.cdr.markForCheck();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleMobileSidebar() {
    this.mobileOpen = !this.mobileOpen;
    this.cdr.markForCheck();
  }
}

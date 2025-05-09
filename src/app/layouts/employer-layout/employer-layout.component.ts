import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../_components/employers/header/header.component';
import { SidebarComponent } from '../_components/employers/slidebar/sidebar.component';
import { fromEvent, Subject, takeUntil, debounceTime } from 'rxjs';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployerLayoutComponent implements OnInit, OnDestroy {
  drawerWidth = 200;
  mobileOpen = false;
  isDesktop = window.innerWidth >= 1280;
  private destroy$ = new Subject<void>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    fromEvent(window, 'resize').pipe(
      debounceTime(100),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      const newIsDesktop = window.innerWidth >= 1280;
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

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StatisticService } from '../../../_services/statistic.service';

@Component({
  selector: 'app-sidebar-view-total',
  imports: [
    CommonModule
  ],
  templateUrl: './sidebar-view-total.component.html',
  styleUrl: './sidebar-view-total.component.css'
})
export class SidebarViewTotalComponent {
  isLoading = true;
  totalView: number | null = null;

  constructor(
    private statisticService: StatisticService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchTotalView();
  }

  fetchTotalView(): void {
    this.isLoading = true;
    this.statisticService.jobSeekerTotalView().subscribe({
      next: (res) => {
        this.totalView = res.data?.totalView ?? null;
        this.isLoading = false;
      },
      error: () => {
        this.totalView = null;
        this.isLoading = false;
      }
    });
  }

  navigateToJobs(): void {
    this.router.navigate(['/job-seeker/jobs']);
  }
}

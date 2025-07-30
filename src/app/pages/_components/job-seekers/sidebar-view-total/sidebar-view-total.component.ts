import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StatisticService } from '../../../../_services/statistic.service';

@Component({
  selector: 'app-sidebar-view-total',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar-view-total.component.html',
  styleUrls: ['./sidebar-view-total.component.css'],
})
export class SidebarViewTotalComponent implements OnInit {
  isLoading = true;
  data: any = null;

  constructor(
    private router: Router,
    private statisticService: StatisticService
  ) {}

  ngOnInit(): void {
    this.fetchStatistics();
  }

  fetchStatistics() {
    this.isLoading = true;
    this.statisticService.jobSeekerTotalView().subscribe({
      next: (res) => {
        this.data = res.data;
      },
      error: (err) => {
        console.error('Error: ', err);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  navigateToJobs() {
    this.router.navigate(['/viec-lam']);
  }
}

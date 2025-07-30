import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticService } from '../../../../_services/statistic.service';

@Component({
  selector: 'app-job-seeker-quantity-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-seeker-quantity-statistics.component.html',
  styleUrls: ['./job-seeker-quantity-statistics.component.css'],
})
export class JobSeekerQuantityStatisticsComponent implements OnInit {
  isLoading = true;
  data: any = null;

  constructor(private statisticService: StatisticService) {}

  ngOnInit(): void {
    this.fetchStatistics();
  }

  fetchStatistics() {
    this.isLoading = true;
    this.statisticService.jobSeekerGeneralStatistics().subscribe({
      next: (res) => {
        this.data = res.data;
      },
      error: (err) => {
        console.error('Error:', err);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}

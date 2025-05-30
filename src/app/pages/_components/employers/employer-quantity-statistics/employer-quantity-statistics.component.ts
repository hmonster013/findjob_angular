import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticService } from '../../../../_services/statistic.service';

@Component({
  selector: 'app-employer-quantity-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employer-quantity-statistics.component.html',
  styleUrls: ['./employer-quantity-statistics.component.css'],
})
export class EmployerQuantityStatisticsComponent implements OnInit {
  isLoading: boolean = false;
  data: any = {};
  animateCards: boolean = false;

  constructor(
    private statisticService: StatisticService
  ) {}

  ngOnInit(): void {
    this.fetchStatistics();
  }

  fetchStatistics() {
    this.isLoading = true;
    this.statisticService.employerGeneralStatistics().subscribe({
      next: (res) => {
        this.data = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching statistics:', err);
        this.isLoading = false;
      },
    });
  }
}

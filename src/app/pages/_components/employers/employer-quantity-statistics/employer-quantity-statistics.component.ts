import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticService } from '../../../../_services/statistic.service';
import { BackdropLoadingComponent } from '../../../../_components/backdrop-loading/backdrop-loading.component';

@Component({
  selector: 'app-employer-quantity-statistics',
  imports: [
    CommonModule,
    BackdropLoadingComponent,
  ],
  templateUrl: './employer-quantity-statistics.component.html',
  styleUrl: './employer-quantity-statistics.component.css'
})
export class EmployerQuantityStatisticsComponent {
  isLoading: boolean = false;
  data: any = {};

  constructor(private statisticService: StatisticService) {}

  ngOnInit(): void {
    this.fetchStatistics();
  }

  fetchStatistics() {
    this.isLoading = true;
    this.statisticService.employerGeneralStatistics().subscribe({
      next: (res) => {
        this.data = res.data || {};
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching statistics:', err);
        this.isLoading = false;
      }
    });
  }
}

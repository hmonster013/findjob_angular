import { Component, ElementRef, ViewChild } from '@angular/core';
import { StatisticService } from '../../_services/statistic.service';
import { Chart, ChartDataset, ChartOptions } from 'chart.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activity-chart',
  imports: [
    CommonModule
  ],
  templateUrl: './activity-chart.component.html',
  styleUrl: './activity-chart.component.css'
})
export class ActivityChartComponent {
  @ViewChild('activityChart') activityChartRef!: ElementRef<HTMLCanvasElement>;

  isLoading = true;
  hasData = false;
  chart: Chart | null = null;
  dataLoaded: boolean = false;
  chartDataFromApi: any = null;

  constructor(private statisticService: StatisticService) {}

  ngOnInit(): void {
    this.fetchStatistics();
  }

  ngAfterViewInit(): void {
    // Nếu data đã load xong trước khi ViewChild xong
    if (this.dataLoaded && this.chartDataFromApi) {
      this.createChart(this.chartDataFromApi);
    }
  }

  fetchStatistics(): void {
    this.isLoading = true;
    this.statisticService.jobSeekerActivityStatistics().subscribe({
      next: (res) => {
        const data = res.data;
        if (!data || !data.labels?.length) {
          this.hasData = false;
          this.isLoading = false;
          return;
        }

        this.chartDataFromApi = data;
        this.dataLoaded = true;
        this.isLoading = false;

        if (this.activityChartRef) {
          this.createChart(data);
        }
      },
      error: () => {
        this.hasData = false;
        this.isLoading = false;
      }
    });
  }

  createChart(data: any): void {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.activityChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: data.title1,
            data: data.data1,
            borderColor: '#6366f1',
            backgroundColor: '#c7d2fe',
            tension: 0.4
          },
          {
            label: data.title2,
            data: data.data2,
            borderColor: '#ec4899',
            backgroundColor: '#fbcfe8',
            tension: 0.4
          },
          {
            label: data.title3,
            data: data.data3,
            borderColor: '#06b6d4',
            backgroundColor: '#cffafe',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: '#f0f1f5' } }
        }
      }
    });
  }
}

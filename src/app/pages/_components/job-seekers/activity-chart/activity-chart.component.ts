import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration } from 'chart.js';
import { StatisticService } from '../../../../_services/statistic.service';

@Component({
  selector: 'app-activity-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-chart.component.html',
  styleUrls: ['./activity-chart.component.css'],
})
export class ActivityChartComponent implements OnInit, AfterViewInit {
  @ViewChild('activityCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  chart: Chart | undefined;
  isLoading = true;
  dataChart: any = null;

  private isCanvasReady = false;

  constructor(
    private statisticService: StatisticService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  ngAfterViewInit(): void {
    this.isCanvasReady = true;
    if (this.dataChart?.labels?.length > 0 && this.canvasRef?.nativeElement) {
      this.renderChart();
    }
  }

  fetchData() {
    this.isLoading = true;
    this.statisticService.jobSeekerActivityStatistics().subscribe({
      next: (res) => {
        this.dataChart = res.data || null;
        this.isLoading = false;
        this.cdr.detectChanges();
        if (this.dataChart?.labels?.length > 0 && this.isCanvasReady) {
          this.renderChart();
        }
      },
      error: (err) => {
        console.error('Error fetching activity data:', err);
        this.dataChart = null;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  renderChart() {
    const ctx = this.canvasRef?.nativeElement.getContext('2d');
    if (!ctx || !this.dataChart) {
      console.error('Cannot render chart: ctx or dataChart is missing', {
        ctx: !!ctx,
        dataChart: this.dataChart,
      });
      return;
    }

    if (
      !Array.isArray(this.dataChart.labels) ||
      !Array.isArray(this.dataChart.data1) ||
      !Array.isArray(this.dataChart.data2) ||
      !Array.isArray(this.dataChart.data3) ||
      this.dataChart.labels.length !== this.dataChart.data1.length ||
      this.dataChart.labels.length !== this.dataChart.data2.length ||
      this.dataChart.labels.length !== this.dataChart.data3.length
    ) {
      console.error('Invalid chart data:', this.dataChart);
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: this.dataChart.labels,
        datasets: [
          {
            label: this.dataChart.title1 || 'Việc đã ứng tuyển',
            data: this.dataChart.data1,
            borderColor: '#d97706', // amber-600
            backgroundColor: 'rgba(217, 119, 6, 0.2)', // amber-600/20%
            fill: false,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
          {
            label: this.dataChart.title2 || 'Việc đã lưu',
            data: this.dataChart.data2,
            borderColor: '#059669', // green-600
            backgroundColor: 'rgba(5, 150, 105, 0.2)', // green-600/20%
            fill: false,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
          {
            label: this.dataChart.title3 || 'Công ty đang theo dõi',
            data: this.dataChart.data3,
            borderColor: '#2563eb', // blue-600
            backgroundColor: 'rgba(37, 99, 235, 0.2)', // blue-600/20%
            fill: false,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#1f2937', // gray-800
              font: {
                size: 14,
              },
            },
          },
          tooltip: {
            backgroundColor: '#1f2937', // gray-800
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.parsed.y}`,
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#4b5563', // gray-600
            },
          },
          y: {
            grid: {
              display: true,
              color: '#e5e7eb', // gray-200
            },
            beginAtZero: true,
            ticks: {
              color: '#4b5563', // gray-600
              stepSize: 1,
            },
          },
        },
      },
    };

    this.chart = new Chart(ctx, config);
  }
}

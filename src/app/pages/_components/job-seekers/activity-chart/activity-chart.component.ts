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
    console.log('ngAfterViewInit: Canvas ready, canvas element:', this.canvasRef?.nativeElement);
    if (this.dataChart?.labels?.length > 0 && this.canvasRef?.nativeElement) {
      console.log('Rendering chart in ngAfterViewInit');
      this.renderChart();
    }
  }

  fetchData() {
    this.isLoading = true;
    this.statisticService.jobSeekerActivityStatistics().subscribe({
      next: (res) => {
        console.log('API response:', res);
        this.dataChart = res.data || null;
        console.log('dataChart:', this.dataChart);
        this.isLoading = false;
        this.cdr.detectChanges(); // Buộc cập nhật giao diện
        if (this.dataChart?.labels?.length > 0 && this.isCanvasReady) {
          console.log('Rendering chart in fetchData');
          this.renderChart();
        }
      },
      error: (err) => {
        console.error('Error fetching activity data:', err);
        this.dataChart = null;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        console.log('fetchData complete, isLoading:', this.isLoading);
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
            borderColor: 'rgba(59, 130, 246, 1)',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            fill: false,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
          {
            label: this.dataChart.title2 || 'Việc đã lưu',
            data: this.dataChart.data2,
            borderColor: 'rgba(16, 185, 129, 1)',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            fill: false,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
          {
            label: this.dataChart.title3 || 'Công ty đang theo dõi',
            data: this.dataChart.data3,
            borderColor: 'rgba(244, 63, 94, 1)',
            backgroundColor: 'rgba(244, 63, 94, 0.2)',
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
          },
          tooltip: {
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
          },
          y: {
            grid: {
              display: true,
            },
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    };

    console.log('Creating chart with config:', config);
    this.chart = new Chart(ctx, config);
    console.log('Chart created:', this.chart);
  }
}

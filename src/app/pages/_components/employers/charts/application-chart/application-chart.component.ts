import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import dayjs from 'dayjs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StatisticService } from '../../../../../_services/statistic.service';

@Component({
  selector: 'app-application-chart',
  imports: [
    CommonModule
  ],
  templateUrl: './application-chart.component.html',
  styleUrl: './application-chart.component.css'
})
export class ApplicationChartComponent {
  @Input() title: string = '';

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chartInstance: Chart | null = null;

  isLoading = true;
  selectedDateRange = [dayjs().subtract(1, 'month'), dayjs()];
  data: any = [];

  private destroy$ = new Subject<void>();

  constructor(private statisticService: StatisticService) {}

  ngOnInit(): void {
    this.fetchStatistics();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }

  fetchStatistics() {
    this.isLoading = true;

    this.statisticService.employerApplicationStatistics({
      startDate: this.selectedDateRange[0].format('YYYY-MM-DD'),
      endDate: this.selectedDateRange[1].format('YYYY-MM-DD')
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        this.data = response.data;
        this.renderChart();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching statistics', error);
        this.isLoading = false;
      }
    });
  }

  renderChart() {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    this.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.data?.labels || [],
        datasets: [
          {
            type: 'line' as const,
            label: this.data?.title2,
            data: this.data?.data2 || [],
            borderColor: 'rgba(68, 29, 160, 1)',
            backgroundColor: 'rgba(68, 29, 160, 0.1)',
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#fff',
            pointHoverBackgroundColor: '#fff',
          },
          {
            type: 'bar' as const,
            label: this.data?.title1,
            data: this.data?.data1 || [],
            backgroundColor: 'rgba(255, 152, 0, 0.9)',
            borderRadius: 4,
            barThickness: 12,
            maxBarThickness: 12,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle',
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#212529',
            bodyColor: '#212529',
            padding: 12,
            boxPadding: 6,
            borderColor: 'rgba(0,0,0,0.1)',
            borderWidth: 1,
            usePointStyle: true
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            border: {
              display: false
            },
            ticks: {
              font: {
                size: 12
              }
            }
          },
          y: {
            grid: {
              color: 'rgba(0,0,0,0.05)'
            },
            border: {
              display: false
            },
            ticks: {
              font: {
                size: 12
              }
            }
          }
        }
      }
    });
  }

  onSubmitDateChange() {
    this.fetchStatistics();
  }
}

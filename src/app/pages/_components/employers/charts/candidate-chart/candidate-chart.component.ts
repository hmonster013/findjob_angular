import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import dayjs from 'dayjs';
import { StatisticService } from '../../../../../_services/statistic.service';
import { EmptyCardComponent } from "../../../../../_components/empty-card/empty-card.component";

@Component({
  selector: 'app-candidate-chart',
  imports: [
    CommonModule,
    EmptyCardComponent
],
  templateUrl: './candidate-chart.component.html',
  styleUrl: './candidate-chart.component.css'
})
export class CandidateChartComponent {
  @Input() title: string = '';

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chartInstance: Chart | null = null;

  isLoading = true;
  selectedDateRange = [dayjs().subtract(1, 'month'), dayjs()];
  allowSubmit = false;
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

    this.statisticService.employerCandidateStatistics({
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
        console.error('Error fetching candidate statistics', error);
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
      type: 'line',
      data: {
        labels: this.data?.labels || [],
        datasets: [
          {
            label: this.data?.title1,
            data: this.data?.data1 || [],
            borderColor: 'rgba(255, 152, 0, 1)',
            backgroundColor: 'rgba(255, 152, 0, 0.1)',
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#fff',
            pointHoverBackgroundColor: '#fff',
          },
          {
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
    this.allowSubmit = false;
    this.fetchStatistics();
  }

  onDateChange(event: any, type: 'start' | 'end') {
    const newDate = dayjs(event.target.value);
    if (type === 'start') {
      this.selectedDateRange[0] = newDate;
    } else {
      this.selectedDateRange[1] = newDate;
    }
    this.allowSubmit = true;
  }
}

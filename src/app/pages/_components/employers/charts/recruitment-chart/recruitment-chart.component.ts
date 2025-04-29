import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import dayjs from 'dayjs';
import { StatisticService } from '../../../../../_services/statistic.service';
import { EmptyCardComponent } from "../../../../../_components/empty-card/empty-card.component";

@Component({
  selector: 'app-recruitment-chart',
  imports: [
    CommonModule,
    EmptyCardComponent
],
  templateUrl: './recruitment-chart.component.html',
  styleUrl: './recruitment-chart.component.css'
})
export class RecruitmentChartComponent {
  @Input() title: string = '';

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chartInstance: Chart | null = null;

  isLoading = true;
  selectedDateRange = [dayjs().subtract(1, 'month'), dayjs()];
  allowSubmit = false;
  data: any[] = [];

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

    this.statisticService.employerRecruitmentStatistics({
      startDate: this.selectedDateRange[0].format('YYYY-MM-DD'),
      endDate: this.selectedDateRange[1].format('YYYY-MM-DD')
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        this.data = response.data || [];
        this.renderChart();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching recruitment statistics', error);
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

    const colors = [
      'rgba(255, 159, 64, 0.9)',
      'rgba(255, 206, 86, 0.9)',
      'rgba(153, 102, 255, 0.9)',
      'rgba(54, 162, 235, 0.9)',
      'rgba(75, 192, 192, 0.9)',
      'rgba(255, 99, 132, 0.9)',
    ];

    const datasets = this.data.map((item, index) => ({
      label: item.label,
      data: item.data || [],
      backgroundColor: colors[index % colors.length],
      stack: 'Stack 0',
      borderRadius: 4,
      barThickness: 12,
      maxBarThickness: 12,
    }));

    this.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [''],
        datasets: datasets,
      },
      options: {
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle',
              font: { size: 12 }
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
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          x: {
            stacked: true,
            grid: { display: false },
            border: { display: false },
            ticks: { font: { size: 12 } }
          },
          y: {
            stacked: true,
            grid: { color: 'rgba(0,0,0,0.05)' },
            border: { display: false },
            ticks: { font: { size: 12 } }
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

import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import dayjs from 'dayjs';
import { StatisticService } from '../../../../../_services/statistic.service';

// Đăng ký Chart.js registerables
Chart.register(...registerables);

@Component({
  selector: 'app-application-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './application-chart.component.html',
  styleUrls: ['./application-chart.component.css'],
})
export class ApplicationChartComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() title: string = 'Thống kê việc làm và ứng tuyển';
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chartInstance: Chart | null = null;

  isLoading = true;
  selectedDateRange = [dayjs().subtract(1, 'month'), dayjs()];
  allowSubmit = false;
  data: any | null = null;
  errorMessage: string | null = null;
  private isCanvasReady = false;
  private dataReady = false;
  private destroy$ = new Subject<void>();

  constructor(
    private statisticService: StatisticService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchStatistics();
  }

  ngAfterViewInit(): void {
    this.isCanvasReady = true;
    if (this.dataReady && this.data !== null && this.data.labels && this.data.labels.length > 0) {
      this.renderChart();
    } else {

    }
    this.cdr.detectChanges();
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
    this.errorMessage = null;

    const startDate = this.selectedDateRange[0].format('YYYY-MM-DD');
    const endDate = this.selectedDateRange[1].format('YYYY-MM-DD');

    if (this.selectedDateRange[0].isAfter(this.selectedDateRange[1])) {
      this.errorMessage = 'Ngày bắt đầu không thể lớn hơn ngày kết thúc';
      this.isLoading = false;
      this.dataReady = false;
      this.cdr.detectChanges();
      return;
    }

    this.statisticService
      .employerApplicationStatistics({ startDate, endDate })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.data = response.data || null;
          this.isLoading = false;
          this.dataReady = true;
          if (this.isCanvasReady && this.data !== null && this.data.labels && this.data.labels.length > 0) {
            this.renderChart();
          } else {

          }
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.errorMessage = error.message || 'Không thể tải dữ liệu thống kê. Vui lòng thử lại.';
          this.isLoading = false;
          this.dataReady = false;
          this.cdr.detectChanges();
        },
      });
  }

  renderChart() {
    if (!this.chartCanvas || !this.isCanvasReady || !this.chartCanvas.nativeElement) {
      return;
    }
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      return;
    }

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    if (!this.data || !Array.isArray(this.data.labels) || this.data.labels.length === 0 ||
        !Array.isArray(this.data.data1) || !Array.isArray(this.data.data2) ||
        this.data.labels.length !== this.data.data1.length || this.data.labels.length !== this.data.data2.length) {
      return;
    }

    const datasets = [
      {
        type: 'line' as const,
        label: String(this.data.title2 || 'Ứng tuyển'),
        data: this.data.data2,
        borderColor: '#F97316', // orange-600
        backgroundColor: 'rgba(249, 115, 22, 0.5)',
        hoverBorderColor: '#FB923C', // orange-500
        tension: 0.2,
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#F97316',
        pointHoverBackgroundColor: '#fff',
        pointStyle: 'circle',
        fill: false,
        order: 1,
      },
      {
        type: 'bar' as const,
        label: String(this.data.title1 || 'Việc làm'),
        data: this.data.data1,
        backgroundColor: 'rgba(59, 130, 246, 0.7)', // blue-500
        hoverBackgroundColor: 'rgba(96, 165, 250, 0.7)', // blue-400
        borderRadius: 4,
        barThickness: 18,
        maxBarThickness: 18,
        categoryPercentage: 0.4,
        barPercentage: 0.8,
        order: 2,
      },
    ];

    this.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.data.labels,
        datasets: datasets,
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
              font: { size: 10, family: "'Inter', sans-serif" },
              color: '#4B5563',
            },
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#4B5563',
            bodyColor: '#4B5563',
            padding: 12,
            boxPadding: 6,
            borderColor: (context: any) => {
              const datasetIndex = context.datasetIndex;
              return datasetIndex === 0 ? 'rgba(249, 115, 22, 0.2)' : 'rgba(59, 130, 246, 0.2)';
            },
            borderWidth: 1,
            usePointStyle: true,
            filter: (tooltipItem) => tooltipItem.raw !== 0,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: {
              font: { size: 10, family: "'Inter', sans-serif" },
              autoSkip: true,
              maxTicksLimit: 15,
              color: '#4B5563',
              callback: (value, index, values) => {
                const label = this.data.labels[index];
                return label ? label.replace(/\/0(\d)/, '/$1') : label;
              },
            },
          },
          y: {
            beginAtZero: true,
            min: 0,
            max: 1.2,
            grid: { color: 'rgba(249, 115, 22, 0.1)' },
            border: { display: false },
            ticks: {
              font: { size: 10, family: "'Inter', sans-serif" },
              stepSize: 0.5,
              color: '#4B5563',
            },
          },
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart',
        },
      },
    });
  }

  onSubmitDateChange() {
    if (this.allowSubmit) {
      this.fetchStatistics();
      this.allowSubmit = false;
    }
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

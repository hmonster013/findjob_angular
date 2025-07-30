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
  selector: 'app-candidate-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './candidate-chart.component.html',
  styleUrls: ['./candidate-chart.component.css'],
})
export class CandidateChartComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() title: string = 'Thống kê hồ sơ ứng tuyển';
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
      .employerCandidateStatistics({ startDate, endDate })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.data = response.data || null;
          this.isLoading = false;
          this.dataReady = true;
          if (this.isCanvasReady && this.data !== null && this.data.labels && this.data.labels.length > 0) {
            this.renderChart();
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

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.data.labels,
        datasets: [
          {
            label: String(this.data.title1 || 'Năm 2025'),
            data: this.data.data1,
            borderColor: '#F97316', // orange-600
            backgroundColor: 'rgba(249, 115, 22, 0.5)',
            hoverBorderColor: '#FB923C', // orange-500
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            pointBackgroundColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            fill: false,
          },
          {
            label: String(this.data.title2 || 'Năm 2024'),
            data: this.data.data2,
            borderColor: '#3B82F6', // blue-500
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            hoverBorderColor: '#60A5FA', // blue-400
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            pointBackgroundColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            fill: false,
          },
        ],
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
              color: '#4B5563', // gray-600
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
              maxTicksLimit: 10,
              color: '#4B5563',
            },
          },
          y: {
            beginAtZero: true,
            min: 0,
            max: 2,
            grid: { color: 'rgba(249, 115, 22, 0.1)' },
            border: { display: false },
            ticks: {
              font: { size: 10, family: "'Inter', sans-serif" },
              stepSize: 1,
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

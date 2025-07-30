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
  selector: 'app-hiring-academic-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hiring-academic-chart.component.html',
  styleUrls: ['./hiring-academic-chart.component.css'],
})
export class HiringAcademicChartComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() title: string = 'Thống kê ứng tuyển theo trình độ học vấn';
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

  isDataEmpty(): boolean {
    return this.data && Array.isArray(this.data.data) && this.data.data.every((value: number) => value === 0);
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
      .employerRecruitmentStatisticsByRank({ startDate, endDate })
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

    if (!this.data || !Array.isArray(this.data.labels) || !Array.isArray(this.data.data) ||
        this.data.labels.length === 0 || this.data.labels.length !== this.data.data.length) {
      return;
    }

    const colors = [
      '#F97316', // orange-600
      '#FB923C', // orange-500
      '#FDBA74', // orange-300
      '#3B82F6', // blue-500
    ];
    const hoverColors = [
      '#FB923C', // orange-500
      '#FDBA74', // orange-300
      '#F97316', // orange-600
      '#60A5FA', // blue-400
    ];

    const filteredLabels: string[] = [];
    const filteredData: number[] = [];
    const filteredColors: string[] = [];
    const filteredHoverColors: string[] = [];
    this.data.labels.forEach((label: string, index: number) => {
      if (this.data.data[index] > 0) {
        filteredLabels.push(label);
        filteredData.push(this.data.data[index]);
        filteredColors.push(colors[index % colors.length]);
        filteredHoverColors.push(hoverColors[index % colors.length]);
      }
    });

    this.chartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: filteredLabels.length > 0 ? filteredLabels : ['Không có dữ liệu'],
        datasets: [
          {
            label: 'Số lượng ứng tuyển',
            data: filteredData.length > 0 ? filteredData : [1],
            backgroundColor: filteredColors.length > 0 ? filteredColors : ['rgba(254, 215, 170, 0.5)'], // orange-200
            hoverBackgroundColor: filteredHoverColors.length > 0 ? filteredHoverColors : ['rgba(254, 215, 170, 0.7)'],
            borderWidth: 1,
            borderColor: '#fff',
            borderRadius: 4,
            spacing: 4,
            hoverOffset: 12,
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
              color: '#4B5563',
            },
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#4B5563',
            bodyColor: '#4B5563',
            padding: 12,
            boxPadding: 6,
            borderColor: 'rgba(249, 115, 22, 0.2)', // orange-600
            borderWidth: 1,
            usePointStyle: true,
            filter: (tooltipItem) => tooltipItem.raw !== 0,
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

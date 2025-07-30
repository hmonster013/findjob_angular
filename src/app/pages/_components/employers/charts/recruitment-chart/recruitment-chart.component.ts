import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import dayjs from 'dayjs';
import { StatisticService } from '../../../../../_services/statistic.service';

Chart.register(...registerables);

interface ChartData {
  label: string;
  data: number[];
}

@Component({
  selector: 'app-recruitment-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recruitment-chart.component.html',
  styleUrls: ['./recruitment-chart.component.css'],
})
export class RecruitmentChartComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() title: string = 'Thống kê tuyển dụng';
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chartInstance: Chart | null = null;

  isLoading = true;
  selectedDateRange = [dayjs().subtract(1, 'month'), dayjs()];
  allowSubmit = false;
  data: ChartData[] = [];
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
    if (this.dataReady && this.data.length > 0) {
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
      .employerRecruitmentStatistics({ startDate, endDate })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.data = response.data || [];
          this.isLoading = false;
          this.dataReady = true;
          if (this.isCanvasReady && this.data.length > 0) {
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

    if (!this.data || !Array.isArray(this.data) || this.data.length === 0) {
      return;
    }

    const colors = [
      'rgba(249, 115, 22, 0.9)', // orange-600
      'rgba(251, 146, 60, 0.9)', // orange-500
      'rgba(253, 186, 116, 0.9)', // orange-300
    ];
    const hoverColors = [
      'rgba(249, 115, 22, 1)', // orange-600 brighter
      'rgba(251, 146, 60, 1)', // orange-500 brighter
      'rgba(253, 186, 116, 1)', // orange-300 brighter
    ];

    const labels = this.data.map((item) => item.label);
    const dataset = {
      label: 'Số lượng',
      data: this.data.map((item) => (item.data && item.data.length > 0 ? item.data[0] : 0)),
      backgroundColor: colors.slice(0, this.data.length),
      hoverBackgroundColor: hoverColors.slice(0, this.data.length),
      borderRadius: 4,
      barThickness: 20,
      maxBarThickness: 20,
      categoryPercentage: 0.6,
      barPercentage: 0.7,
    };

    this.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [dataset],
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#4B5563', // gray-600
            bodyColor: '#4B5563',
            padding: 12,
            boxPadding: 6,
            borderColor: 'rgba(249, 115, 22, 0.2)', // orange-600
            borderWidth: 1,
            usePointStyle: true,
            filter: (tooltipItem) => tooltipItem.raw !== 0,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: {
              font: { size: 10, family: "'Inter', sans-serif" },
              autoSkip: false,
              color: '#4B5563', // gray-600
            },
          },
          y: {
            beginAtZero: true,
            min: 0,
            max: 2,
            grid: { color: 'rgba(249, 115, 22, 0.1)' }, // orange-600
            border: { display: false },
            ticks: {
              font: { size: 10, family: "'Inter', sans-serif" },
              stepSize: 1,
              color: '#4B5563', // gray-600
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

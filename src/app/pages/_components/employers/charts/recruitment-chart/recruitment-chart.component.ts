import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import dayjs from 'dayjs';
import { StatisticService } from '../../../../../_services/statistic.service';

// Đăng ký Chart.js registerables một lần
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
    console.log('ngOnInit: Fetching statistics');
    this.fetchStatistics();
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit: Canvas ready, chartCanvas:', !!this.chartCanvas);
    this.isCanvasReady = true;
    if (this.dataReady && this.data.length > 0) {
      console.log('ngAfterViewInit: Rendering chart with data:', this.data);
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
      console.warn('fetchStatistics: Invalid date range');
      this.errorMessage = 'Ngày bắt đầu không thể lớn hơn ngày kết thúc';
      this.isLoading = false;
      this.dataReady = false;
      this.cdr.detectChanges();
      return;
    }

    console.log('fetchStatistics: Calling API with startDate:', startDate, 'endDate:', endDate);
    this.statisticService
      .employerRecruitmentStatistics({ startDate, endDate })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('fetchStatistics: API response:', response);
          this.data = response.data || [];
          this.isLoading = false;
          this.dataReady = true;
          if (this.isCanvasReady && this.data.length > 0) {
            console.log('fetchStatistics: Rendering chart with data:', this.data);
            this.renderChart();
          } else {
            console.log('fetchStatistics: Canvas not ready or no data, waiting for canvas');
          }
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('fetchStatistics: Error fetching data:', error);
          this.errorMessage = error.message || 'Không thể tải dữ liệu thống kê. Vui lòng thử lại.';
          this.isLoading = false;
          this.dataReady = false;
          this.cdr.detectChanges();
        },
      });
  }

  renderChart() {
    if (!this.chartCanvas || !this.isCanvasReady || !this.chartCanvas.nativeElement) {
      console.error('renderChart: Canvas not ready, chartCanvas:', !!this.chartCanvas, 'isCanvasReady:', this.isCanvasReady);
      return;
    }
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('renderChart: Context not available');
      return;
    }

    if (this.chartInstance) {
      console.log('renderChart: Destroying existing chart');
      this.chartInstance.destroy();
    }

    if (!this.data || !Array.isArray(this.data) || this.data.length === 0) {
      console.error('renderChart: Invalid chart data:', this.data);
      return;
    }

    console.log('renderChart: Preparing chart data, labels:', this.data.map(item => item.label));
    const colors = [
      'rgba(255, 159, 64, 0.9)', // Orange
      'rgba(255, 206, 86, 0.9)', // Yellow
      'rgba(153, 102, 255, 0.9)', // Purple
      'rgba(54, 162, 235, 0.9)', // Blue
      'rgba(75, 192, 192, 0.9)', // Teal
      'rgba(255, 99, 132, 0.9)', // Red
    ];

    const labels = this.data.map((item) => item.label);
    // Tạo một dataset duy nhất với các giá trị số
    const dataset = {
      label: 'Số lượng',
      data: this.data.map(item => item.data && item.data.length > 0 ? item.data[0] : 0),
      backgroundColor: colors.slice(0, this.data.length),
      borderRadius: 4,
      barThickness: 20, // Giảm độ rộng cột
      maxBarThickness: 20,
      categoryPercentage: 0.6, // Tăng khoảng cách giữa các cột
      barPercentage: 0.7,
    };

    console.log('renderChart: Creating chart with labels:', labels, 'dataset:', dataset);
    this.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [dataset], // Chỉ dùng một dataset
      },
      options: {
        plugins: {
          legend: {
            display: false, // Ẩn legend vì chỉ có một dataset
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#212529',
            bodyColor: '#212529',
            padding: 12,
            boxPadding: 6,
            borderColor: 'rgba(0,0,0,0.1)',
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
              font: { size: 12 },
              autoSkip: false, // Đảm bảo tất cả nhãn hiển thị
            },
          },
          y: {
            beginAtZero: true,
            min: 0,
            max: 2, // Giới hạn trục Y vì giá trị tối đa là 1
            grid: { color: 'rgba(0,0,0,0.05)' },
            border: { display: false },
            ticks: {
              font: { size: 12 },
              stepSize: 1,
            },
          },
        },
      },
    });
    console.log('renderChart: Chart created successfully');
  }

  onSubmitDateChange() {
    if (this.allowSubmit) {
      console.log('onSubmitDateChange: Fetching new statistics');
      this.fetchStatistics();
      this.allowSubmit = false;
    }
  }

  onDateChange(event: any, type: 'start' | 'end') {
    const newDate = dayjs(event.target.value);
    console.log('onDateChange: New date:', newDate.format('YYYY-MM-DD'), 'type:', type);
    if (type === 'start') {
      this.selectedDateRange[0] = newDate;
    } else {
      this.selectedDateRange[1] = newDate;
    }
    this.allowSubmit = true;
  }
}

import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import dayjs from 'dayjs';
import { StatisticService } from '../../../../../_services/statistic.service';

// Đăng ký Chart.js registerables một lần
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
    console.log('ngOnInit: Fetching statistics');
    this.fetchStatistics();
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit: Canvas ready, chartCanvas:', !!this.chartCanvas);
    this.isCanvasReady = true;
    if (this.dataReady && this.data !== null && this.data.labels && this.data.labels.length > 0) {
      console.log('ngAfterViewInit: Rendering chart with data:', this.data);
      this.renderChart();
    } else {
      console.log('ngAfterViewInit: No valid data to render chart, data:', this.data);
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
      .employerApplicationStatistics({ startDate, endDate })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('fetchStatistics: API response:', response);
          this.data = response.data || null;
          this.isLoading = false;
          this.dataReady = true;
          if (this.isCanvasReady && this.data !== null && this.data.labels && this.data.labels.length > 0) {
            console.log('fetchStatistics: Rendering chart with data:', this.data);
            this.renderChart();
          } else {
            console.log('fetchStatistics: Canvas not ready or no valid data, data:', this.data);
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

    // Kiểm tra data không phải null và hợp lệ
    if (!this.data || !Array.isArray(this.data.labels) || this.data.labels.length === 0 ||
        !Array.isArray(this.data.data1) || !Array.isArray(this.data.data2) ||
        this.data.labels.length !== this.data.data1.length || this.data.labels.length !== this.data.data2.length) {
      console.error('renderChart: Invalid chart data:', this.data);
      return;
    }

    console.log('renderChart: Preparing chart data, labels:', this.data.labels);
    const datasets = [
      {
        type: 'line' as const,
        label: String(this.data.title2 || 'Ứng tuyển'),
        data: this.data.data2,
        borderColor: this.data.backgroundColor2 || 'red',
        backgroundColor: this.data.backgroundColor2 || 'rgba(255, 0, 0, 0.1)',
        tension: 0.2,
        borderWidth: 2,
        pointRadius: 5, // Tăng kích thước điểm
        pointHoverRadius: 7,
        pointBackgroundColor: '#fff',
        pointBorderColor: 'red', // Viền điểm đỏ
        pointHoverBackgroundColor: '#fff',
        pointStyle: 'circle',
        fill: false,
        order: 1, // Đường hiển thị trên cùng
      },
      {
        type: 'bar' as const,
        label: String(this.data.title1 || 'Việc làm'),
        data: this.data.data1,
        backgroundColor: this.data.backgroundColor1 ? `rgba(75, 192, 192, 0.7)` : 'rgba(75, 192, 192, 0.7)', // Thêm độ trong suốt
        borderRadius: 4,
        barThickness: 18, // Độ rộng cột vừa phải
        maxBarThickness: 18,
        categoryPercentage: 0.4, // Khoảng cách giữa cột
        barPercentage: 0.8,
        order: 2, // Cột hiển thị dưới đường
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
              font: { size: 12 },
            },
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
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: {
              font: { size: 12 },
              autoSkip: true,
              maxTicksLimit: 15, // Tăng số nhãn hiển thị
              callback: (value, index, values) => {
                const label = this.data.labels[index];
                return label ? label.replace(/\/0(\d)/, '/$1') : label; // Rút ngắn "10/04" thành "10/4"
              },
            },
          },
          y: {
            beginAtZero: true,
            min: 0,
            max: 1.2, // Giảm max để nổi bật giá trị 1
            grid: { color: 'rgba(0,0,0,0.05)' },
            border: { display: false },
            ticks: {
              font: { size: 12 },
              stepSize: 0.5,
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

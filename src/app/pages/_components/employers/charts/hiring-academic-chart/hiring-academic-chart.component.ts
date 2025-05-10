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

  // Kiểm tra xem tất cả giá trị trong data.data có bằng 0 không
  isDataEmpty(): boolean {
    return this.data && Array.isArray(this.data.data) && this.data.data.every((value: number) => value === 0);
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
      .employerRecruitmentStatisticsByRank({ startDate, endDate })
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
    if (!this.data || !Array.isArray(this.data.labels) || !Array.isArray(this.data.data) ||
        this.data.labels.length === 0 || this.data.labels.length !== this.data.data.length) {
      console.error('renderChart: Invalid chart data:', this.data);
      return;
    }

    // Lọc dữ liệu để chỉ hiển thị các phần có giá trị > 0
    const filteredLabels: string[] = [];
    const filteredData: number[] = [];
    const filteredColors: string[] = [];
    this.data.labels.forEach((label: string, index: number) => {
      if (this.data.data[index] > 0) {
        filteredLabels.push(label);
        filteredData.push(this.data.data[index]);
        filteredColors.push(this.data.backgroundColor[index] || `rgba(255, 99, 132, 0.9)`);
      }
    });

    console.log('renderChart: Preparing chart data, labels:', filteredLabels, 'data:', filteredData);
    this.chartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: filteredLabels.length > 0 ? filteredLabels : ['Không có dữ liệu'],
        datasets: [
          {
            label: 'Số lượng ứng tuyển',
            data: filteredData.length > 0 ? filteredData : [1], // Giá trị giả nếu không có dữ liệu
            backgroundColor: filteredColors.length > 0 ? filteredColors : ['rgba(200, 200, 200, 0.5)'], // Màu xám nếu không có dữ liệu
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
              font: { size: 14 },
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

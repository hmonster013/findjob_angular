import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration } from 'chart.js';
import { StatisticService } from '../../../../_services/statistic.service';

@Component({
  selector: 'app-activity-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-chart.component.html',
  styleUrls: ['./activity-chart.component.css'],
})
export class ActivityChartComponent implements OnInit, AfterViewInit {
  @ViewChild('activityCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  chart: Chart | undefined;
  isLoading = true;
  dataChart: any[] = [];

  constructor(private statisticService: StatisticService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  ngAfterViewInit(): void {
    // Khởi tạo chart sau khi có canvas
  }

  fetchData() {
    this.isLoading = true;
    this.statisticService.jobSeekerActivityStatistics().subscribe({
      next: (res) => {
        const result = res.data || [];
        this.dataChart = result;
        if (this.dataChart.length > 0) {
          this.renderChart();
        }
      },
      error: (err) => {
        console.error('Error fetching activity data:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  renderChart() {
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Nếu đã có chart cũ thì destroy trước
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = this.dataChart.map(item => item.label);
    const counts = this.dataChart.map(item => item.count);

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Hoạt động',
            data: counts,
            borderColor: 'rgba(59, 130, 246, 1)',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            fill: false,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => `Số lượng: ${context.parsed.y}`,
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false, // <-- Chỉ tắt gridline x
            }
          },
          y: {
            grid: {
              display: true, // nếu muốn giữ đường grid y
            },
            beginAtZero: true
          }
        },
      },
    };

    this.chart = new Chart(ctx, config);
  }
}

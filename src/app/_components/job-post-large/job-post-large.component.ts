import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import dayjs from 'dayjs';

@Component({
  selector: 'app-job-post-large',
  imports: [
    CommonModule
  ],
  templateUrl: './job-post-large.component.html',
  styleUrl: './job-post-large.component.css'
})
export class JobPostLargeComponent {
  @Input() id!: number;
  @Input() slug!: string;
  @Input() companyImageUrl!: string;
  @Input() companyName!: string;
  @Input() jobName!: string;
  @Input() cityName!: string;
  @Input() deadline!: string;
  @Input() salaryMin?: number;
  @Input() salaryMax?: number;
  @Input() isHot: boolean = false;
  @Input() isUrgent: boolean = false;
  @Input() isLoading: boolean = false;

  constructor(private router: Router) {}

  navigateToDetail() {
    if (this.slug) {
      this.router.navigate(['/viec-lam', this.slug]);
    }
  }

  salaryString(min?: number, max?: number): string {
    if (!min && !max) return 'Thỏa thuận';

    const formatNumber = (num: number): string => {
      const million = num / 1_000_000;
      return million % 1 === 0 ? million.toString() : million.toFixed(2);
    };

    if (min && max) {
      return `${formatNumber(min)} - ${formatNumber(max)} tr`;
    }
    if (min) {
      return `Từ ${formatNumber(min)} tr`;
    }
    return `Đến ${formatNumber(max!)} tr`;
  }

  get deadlineFormatted(): string {
    return this.deadline ? dayjs(this.deadline).format('DD/MM/YYYY') : 'Chưa cập nhật';
  }

  get daysLeft(): number {
    return this.deadline ? dayjs(this.deadline).diff(dayjs(), 'day') : 0;
  }
}

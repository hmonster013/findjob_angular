import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import dayjs from 'dayjs';

@Component({
  selector: 'app-job-post-action',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './job-post-action.component.html',
  styleUrl: './job-post-action.component.css'
})
export class JobPostActionComponent {
  @Input() id!: number;
  @Input() slug!: string;
  @Input() companyImageUrl!: string;
  @Input() companyName!: string;
  @Input() jobName!: string;
  @Input() cityName!: string;
  @Input() deadline!: string;
  @Input() salaryMin?: number;
  @Input() salaryMax?: number;
  @Input() isLoading: boolean = false;

  stackDirection: 'row' | 'column' = 'column';

  constructor(private router: Router) {}

  ngOnInit() {
    this.updateLayout();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateLayout();
  }

  updateLayout() {
    const width = window.innerWidth;
    this.stackDirection = width >= 600 ? 'row' : 'column';
  }

  navigateToDetail() {
    if (this.slug) {
      this.router.navigate(['/job', this.slug]);
    }
  }

  salaryStringFn(min?: number, max?: number): string {
    if (!min && !max) return 'Thỏa thuận';
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} đ`;
    if (min) return `Từ ${min.toLocaleString()} đ`;
    return `Đến ${max?.toLocaleString()} đ`;
  }

  get formatDeadline() {
    return this.deadline ? dayjs(this.deadline).format('DD/MM/YYYY') : 'Chưa cập nhật';
  }
}

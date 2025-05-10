import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NoDataCardComponent } from "../../../../_components/no-data-card/no-data-card.component";

interface Resume {
  slug?: string;
  title?: string;
  userDict?: { fullName: string };
  salaryMin?: number;
  salaryMax?: number;
  experience?: string;
  city?: string;
}

interface ResumeRow {
  resume?: Resume;
  createAt?: string;
}

@Component({
  selector: 'app-saved-resume-table',
  standalone: true,
  imports: [CommonModule, NoDataCardComponent, DatePipe],
  templateUrl: './saved-resume-table.component.html'
})
export class SavedResumeTableComponent {
  @Input() dataSource: ResumeRow[] = [];
  @Input() isLoading: boolean = false;
  @Input() total: number = 0;
  @Input() page: number = 1;
  @Input() rowsPerPage: number = 10;

  @Output() edit = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() rowsPerPageChange = new EventEmitter<number>();

  constructor(private router: Router) {}

  viewProfile(slug: string | undefined) {
    if (slug) {
      this.router.navigate(['/chi-tiet-ung-vien/', slug]);
    }
  }

  totalPages(): number {
    return Math.ceil(this.total / this.rowsPerPage) || 1;
  }

  formatSalary(min: number | undefined, max: number | undefined): string {
    if (!min && !max) return '---';
    return `${min?.toLocaleString() || ''} - ${max?.toLocaleString() || ''}`;
  }
}

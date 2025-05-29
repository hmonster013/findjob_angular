import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NoDataCardComponent } from '../../../../_components/no-data-card/no-data-card.component';
import Swal from 'sweetalert2';

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
  templateUrl: './saved-resume-table.component.html',
  styleUrls: ['./saved-resume-table.component.css'],
  providers: [DatePipe],
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

  confirmUnsave(slug: string | undefined) {
    if (!slug) return;
    Swal.fire({
      title: 'Hủy lưu hồ sơ?',
      text: 'Bạn có chắc muốn hủy lưu hồ sơ này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Hủy lưu',
      cancelButtonText: 'Hủy',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700',
        cancelButton: 'bg-orange-200 text-orange-800 px-4 py-2 rounded-md hover:bg-orange-300 mr-2',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.edit.emit(slug);
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.rowsPerPage) || 1;
  }

  getVisiblePages(): number[] {
    const maxVisiblePages = 5;
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, this.page - half);
    let end = Math.min(this.totalPages, start + maxVisiblePages - 1);
    start = Math.max(1, end - maxVisiblePages + 1);
    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  formatSalary(min: number | undefined, max: number | undefined): string {
    if (!min && !max) return '---';
    return `${min?.toLocaleString() || ''} - ${max?.toLocaleString() || ''}`;
  }

  onChangeRowsPerPage(event: Event) {
    const value = +(event.target as HTMLSelectElement).value;
    this.rowsPerPageChange.emit(value);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}

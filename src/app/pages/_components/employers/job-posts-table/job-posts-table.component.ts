import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import dayjs from 'dayjs';
import { NoDataCardComponent } from '../../../../_components/no-data-card/no-data-card.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-job-posts-table',
  standalone: true,
  imports: [CommonModule, NoDataCardComponent],
  templateUrl: './job-posts-table.component.html',
  styleUrls: ['./job-posts-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobPostsTableComponent {
  @Input() dataSource: any[] = [];
  @Input() isLoading: boolean = false;
  @Input() total: number = 0;
  @Input() page: number = 0; // 0-based
  @Input() rowsPerPage: number = 5;
  @Input() order: 'asc' | 'desc' = 'asc';
  @Input() orderBy: string = 'createAt';
  @Input() allConfig: any = {};
  @Input() headCells: any[] = [];

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() rowsPerPageChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<string>();

  JOB_POST_STATUS_BG_COLOR: { [key: string]: string } = {
    active: 'bg-orange-100 text-orange-800',
    inactive: 'bg-orange-100 text-orange-800',
    expired: 'bg-orange-100 text-orange-800'
  };

  formatDate(date: string): string {
    return dayjs(date).format('DD/MM/YYYY');
  }

  onSort(field: string) {
    this.sortChange.emit(field);
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.rowsPerPage) || 1;
  }

  getVisiblePages(): number[] {
    const maxVisiblePages = 5;
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, this.page + 1 - half);
    let end = Math.min(this.totalPages, start + maxVisiblePages - 1);
    start = Math.max(1, end - maxVisiblePages + 1);
    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  onChangeRowsPerPage(event: Event) {
    const value = +(event.target as HTMLSelectElement).value;
    this.rowsPerPageChange.emit(value);
  }

  confirmDelete(row: any) {
    Swal.fire({
      title: 'Xóa tin tuyển dụng?',
      text: `Bạn có chắc muốn xóa "${row.jobName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700',
        cancelButton: 'bg-orange-200 text-orange-800 px-4 py-2 rounded-md hover:bg-orange-300 mr-2'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.delete.emit(row);
      }
    });
  }
}

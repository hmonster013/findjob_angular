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
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    expired: 'bg-red-100 text-red-800'
  };

  formatDate(date: string): string {
    return dayjs(date).format('DD/MM/YYYY');
  }

  onSort(field: string) {
    this.sortChange.emit(field);
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages()) {
      this.pageChange.emit(page);
    }
  }

  totalPages(): number {
    return Math.ceil(this.total / this.rowsPerPage) || 1;
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
        confirmButton: 'bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700',
        cancelButton: 'bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 mr-2'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.delete.emit(row);
      }
    });
  }
}

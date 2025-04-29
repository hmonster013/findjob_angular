import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import dayjs from 'dayjs';

@Component({
  selector: 'app-job-posts-table',
  imports: [
    CommonModule
  ],
  templateUrl: './job-posts-table.component.html',
  styleUrl: './job-posts-table.component.css'
})
export class JobPostsTableComponent {
  @Input() dataSource: any[] = [];
  @Input() isLoading: boolean = false;
  @Input() total: number = 0;
  @Input() page: number = 1;
  @Input() rowsPerPage: number = 10;
  @Input() order: 'asc' | 'desc' = 'desc';
  @Input() orderBy: string = 'updatedAt';
  @Input() allConfig: any = {};

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() rowsPerPageChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<string>();

  formatDate(date: string): string {
    return dayjs(date).format('DD/MM/YYYY');
  }

  onSort(field: string) {
    this.sortChange.emit(field);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
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
}

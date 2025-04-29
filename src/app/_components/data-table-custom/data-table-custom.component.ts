import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-data-table-custom',
  imports: [
    CommonModule
  ],
  templateUrl: './data-table-custom.component.html',
  styleUrl: './data-table-custom.component.css'
})
export class DataTableCustomComponent {
  @Input() headCells: any[] = [];
  @Input() rows: any[] = [];
  @Input() count: number = 0;
  @Input() rowsPerPage: number = 10;
  @Input() page: number = 1;
  @Input() isLoading: boolean = false;

  @Output() sortChanged = new EventEmitter<{ field: string, direction: 'asc' | 'desc' }>();
  @Output() pageChanged = new EventEmitter<number>();

  skeletonArray = Array(10);

  sortField: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  handleSort(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.sortChanged.emit({ field: this.sortField, direction: this.sortDirection });
  }

  handlePageChange(newPage: number) {
    this.page = newPage;
    this.pageChanged.emit(this.page);
  }

  get totalPages() {
    return Math.ceil(this.count / this.rowsPerPage);
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import dayjs from 'dayjs';
import { NoDataCardComponent } from "../../../../_components/no-data-card/no-data-card.component";
@Component({
  selector: 'app-saved-resume-table',
  imports: [
    CommonModule,
    NoDataCardComponent
],
  templateUrl: './saved-resume-table.component.html',
  styleUrl: './saved-resume-table.component.css'
})
export class SavedResumeTableComponent {
  @Input() dataSource: any[] = [];
  @Input() isLoading: boolean = false;
  @Input() total: number = 0;
  @Input() page: number = 1;
  @Input() rowsPerPage: number = 10;

  @Output() edit = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() rowsPerPageChange = new EventEmitter<number>();

  constructor(private router: Router) {}

  viewProfile(slug: string) {
    if (slug) {
      this.router.navigate(['/employer/profiles', slug]);
    }
  }

  totalPages(): number {
    return Math.ceil(this.total / this.rowsPerPage) || 1;
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NoDataCardComponent } from '../../../../_components/no-data-card/no-data-card.component';
import Swal from 'sweetalert2';
import { CommonService } from '../../../../_services/common.service';

@Component({
  selector: 'app-saved-resume-table',
  standalone: true,
  imports: [CommonModule, NoDataCardComponent, DatePipe],
  templateUrl: './saved-resume-table.component.html',
  styleUrls: ['./saved-resume-table.component.css'],
  providers: [DatePipe],
})
export class SavedResumeTableComponent implements OnInit {
  @Input() dataSource: any[] = [];
  @Input() isLoading: boolean = false;
  @Input() total: number = 0;
  @Input() page: number = 1;
  @Input() rowsPerPage: number = 10;

  @Output() edit = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() rowsPerPageChange = new EventEmitter<number>();

  allConfigs: any;

  constructor(
    private router: Router,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.getConfigs();
  }

  getConfigs() {
    this.commonService.getConfigs().subscribe({
      next: (res) => {
        this.allConfigs = res.data;
      },
      error: (err) => {
        console.error('Lỗi khi lấy configs:', err);
      }
    });
  }

  // Lấy tên kinh nghiệm từ id
  getExperienceName(experienceId: number | null | undefined): string {
    if (!experienceId || !this.allConfigs?.experienceDict) {
      return '---';
    }
    return this.allConfigs.experienceDict[experienceId] || '---';
  }

  // Lấy tên thành phố từ id
  getCityName(cityId: number | null | undefined): string {
    if (!cityId || !this.allConfigs?.cityDict) {
      return '---';
    }
    return this.allConfigs.cityDict[cityId] || '---';
  }

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

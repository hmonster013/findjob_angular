import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../_services/common.service';
import { SendMailCardComponent } from '../send-mail-card/send-mail-card.component';
import { NoDataCardComponent } from '../../../../_components/no-data-card/no-data-card.component';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-applied-resume-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SendMailCardComponent,
    NoDataCardComponent,
  ],
  templateUrl: './applied-resume-table.component.html',
  styleUrls: ['./applied-resume-table.component.css'],
  providers: [DatePipe],
})
export class AppliedResumeTableComponent implements OnInit, OnDestroy {
  @Input() dataSource: any[] = [];
  @Input() isLoading: boolean = false;
  @Input() total: number = 0;
  @Input() page: number = 0;
  @Input() rowsPerPage: number = 5;
  @Output() delete = new EventEmitter<number>();
  @Output() changeStatus = new EventEmitter<{ id: number; status: number }>();
  @Output() sendEmail = new EventEmitter<any>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() rowsPerPageChange = new EventEmitter<number>();

  openSendMailPopup: boolean = false;
  selectedSendData: any = null;
  applicationStatusOptions: any[] = [];
  applicationStatusDict: { [key: string]: string } = {};
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private commonService: CommonService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.fetchStatusOptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchStatusOptions() {
    this.commonService.getConfigs().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.applicationStatusOptions = res.data?.applicationStatusOptions || [];
        this.applicationStatusDict = res.data?.applicationStatusDict || {};
      },
      error: () => {
        this.toastr.error('Không thể tải danh sách trạng thái!');
      },
    });
  }

  viewProfile(slug: string) {
    if (slug) {
      this.router.navigate(['/chi-tiet-ung-vien/', slug]);
    } else {
      this.toastr.error('Hồ sơ không tồn tại!');
    }
  }

  confirmDelete(id: number) {
    Swal.fire({
      title: 'Xóa ứng viên?',
      text: 'Bạn có chắc muốn xóa hồ sơ ứng viên này?',
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
        this.delete.emit(id);
      }
    });
  }

  handleChangeApplicationStatus(newStatus: number, row: any) {
    const currentStatus = parseInt(row.status); // Lưu trạng thái hiện tại
    if (isNaN(currentStatus) || isNaN(newStatus)) {
      Swal.fire({
        title: 'Lỗi',
        text: 'Trạng thái không hợp lệ!',
        icon: 'error',
        confirmButtonText: 'Đóng',
        buttonsStyling: false,
        customClass: {
          confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700'
        }
      });
      return;
    }

    const statusOrder = [1, 2, 3, 4, 5, 6];
    if (statusOrder.indexOf(newStatus) < statusOrder.indexOf(currentStatus)) {
      Swal.fire({
        title: 'Không hợp lệ',
        text: `Không thể chuyển trạng thái từ "${this.applicationStatusDict[currentStatus]}" sang "${this.applicationStatusDict[newStatus]}"!`,
        icon: 'error',
        confirmButtonText: 'Đóng',
        buttonsStyling: false,
        customClass: {
          confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700'
        }
      });
      return;
    }

    Swal.fire({
      title: 'Thay đổi trạng thái?',
      text: `Trạng thái sẽ được cập nhật thành "${this.applicationStatusDict[newStatus]}"`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Cập nhật',
      cancelButtonText: 'Hủy',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700',
        cancelButton: 'bg-orange-200 text-orange-800 px-4 py-2 rounded-md hover:bg-orange-300 mr-2'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.changeStatus.emit({ id: row.id, status: newStatus });
      }
    });
  }

  openSendMail(row: any) {
    if (!row?.fullName || !row?.email) {
      this.toastr.error('Thông tin ứng viên không đầy đủ!');
      return;
    }
    this.selectedSendData = {
      id: row.id,
      fullName: row.fullName,
      email: row.email,
      title: `Thư mời ứng tuyển: ${row.jobName || 'Công việc'}`,
      content: '',
      isSendMe: true,
    };
    this.openSendMailPopup = true;
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

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '---';
  }

  onChangeRowsPerPage(event: Event) {
    const value = +(event.target as HTMLSelectElement).value;
    this.rowsPerPageChange.emit(value);
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}

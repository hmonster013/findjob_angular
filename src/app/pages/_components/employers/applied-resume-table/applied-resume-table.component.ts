import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../_services/common.service';
import { confirmModal, errorModal } from '../../../../_utils/sweetalert2-modal';
import { SendMailCardComponent } from '../send-mail-card/send-mail-card.component';
import { NoDataCardComponent } from '../../../../_components/no-data-card/no-data-card.component';
import { BackdropLoadingComponent } from '../../../../_components/backdrop-loading/backdrop-loading.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-applied-resume-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SendMailCardComponent,
    NoDataCardComponent,
    BackdropLoadingComponent,
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
  @Input() rowsPerPage: number = 10; // Đồng bộ với pageSize
  @Output() delete = new EventEmitter<number>();
  @Output() changeStatus = new EventEmitter<{ id: number; status: string }>();
  @Output() sendEmail = new EventEmitter<any>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() rowsPerPageChange = new EventEmitter<number>();

  openSendMailPopup: boolean = false;
  selectedSendData: any = null;
  isFullScreenLoading: boolean = false;
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
        this.applicationStatusOptions = res.data?.applicationStatusOptions || [
          { id: '1', name: 'Chờ xác nhận' },
          { id: '2', name: 'Đã liên hệ' },
          { id: '3', name: 'Đã test' },
          { id: '4', name: 'Đã phỏng vấn' },
          { id: '5', name: 'Trúng tuyển' },
          { id: '6', name: 'Không trúng tuyển' },
        ];
        this.applicationStatusDict = res.data?.applicationStatusDict || {
          '1': 'Chờ xác nhận',
          '2': 'Đã liên hệ',
          '3': 'Đã test',
          '4': 'Đã phỏng vấn',
          '5': 'Trúng tuyển',
          '6': 'Không trúng tuyển',
        };
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
    confirmModal(
      () => {
        this.delete.emit(id);
      },
      'Bạn có chắc chắn muốn xóa ứng viên này?',
      'Hành động này không thể hoàn tác.',
      'warning'
    );
  }

  handleChangeApplicationStatus(event: Event, row: any) {
    const target = event.target as HTMLSelectElement;
    const newStatus = target.value;
    const currentStatus = row.status.toString();

    const statusOrder = ['1', '2', '3', '4', '5', '6'];
    if (statusOrder.indexOf(newStatus) < statusOrder.indexOf(currentStatus)) {
      errorModal(
        'Không hợp lệ',
        `Không thể chuyển trạng thái từ "${this.applicationStatusDict[currentStatus]}" sang "${this.applicationStatusDict[newStatus]}"!`
      );
      target.value = currentStatus;
      return;
    }

    confirmModal(
      () => {
        this.changeStatus.emit({ id: row.id, status: newStatus });
      },
      'Bạn có chắc muốn thay đổi trạng thái ứng viên?',
      `Trạng thái sẽ được cập nhật thành "${this.applicationStatusDict[newStatus]}".`,
      'question'
    );
  }

  openSendMail(row: any) {
    if (!row?.fullName || !row?.email) {
      this.toastr.error('Thông tin ứng viên không đầy đủ!');
      return;
    }
    this.selectedSendData = {
      id: row.id, // Thêm id để gửi email
      fullName: row.fullName,
      email: row.email,
      title: `Thư mời ứng tuyển: ${row.jobName || 'Công việc'}`,
      content: '',
      isSendMe: true,
    };
    this.openSendMailPopup = true;
  }

  totalPages(): number {
    return Math.ceil(this.total / this.rowsPerPage) || 1;
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '---';
  }
}

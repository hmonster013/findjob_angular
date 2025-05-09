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

@Component({
  selector: 'app-applied-resume-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SendMailCardComponent,
    NoDataCardComponent,
    BackdropLoadingComponent
  ],
  templateUrl: './applied-resume-table.component.html',
  styleUrls: ['./applied-resume-table.component.css']
})
export class AppliedResumeTableComponent implements OnInit, OnDestroy {
  @Input() dataSource: any[] = [];
  @Input() isLoading: boolean = false;
  @Input() total: number = 0;
  @Input() page: number = 0; // 0-based như React
  @Input() rowsPerPage: number = 5; // Mặc định 5 như React
  @Output() delete = new EventEmitter<number>();
  @Output() changeStatus = new EventEmitter<{ id: number, status: string }>();
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
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.fetchStatusOptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchStatusOptions() {
    this.commonService.getConfigs().pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.applicationStatusOptions = res.data?.applicationStatusOptions || [
        { id: 'PENDING', name: 'Đang chờ' },
        { id: 'IN_PROGRESS', name: 'Đang phỏng vấn' },
        { id: 'ACCEPTED', name: 'Đã nhận việc' },
        { id: 'REJECTED', name: 'Đã từ chối' }
      ];
      this.applicationStatusDict = res.data?.applicationStatusDict || {
        PENDING: 'Đang chờ',
        IN_PROGRESS: 'Đang phỏng vấn',
        ACCEPTED: 'Đã nhận việc',
        REJECTED: 'Đã từ chối'
      };
    });
  }

  viewProfile(slug: string) {
    if (slug) {
      this.router.navigate(['/employer/profiles', slug]);
    }
  }

  confirmDelete(id: number) {
    confirmModal(() => {
      this.delete.emit(id);
    }, 'Bạn có chắc chắn muốn xóa ứng viên này?', 'Hành động này không thể hoàn tác.', 'warning');
  }

  handleChangeApplicationStatus(event: Event, row: any) {
    const target = event.target as HTMLSelectElement;
    const newStatus = target.value;
    const oldStatus = row.applicationStatus;

    const statusOrder = ['PENDING', 'IN_PROGRESS', 'ACCEPTED', 'REJECTED'];
    if (statusOrder.indexOf(newStatus) < statusOrder.indexOf(oldStatus)) {
      errorModal('Không hợp lệ', `Không thể chuyển trạng thái từ "${this.applicationStatusDict[oldStatus]}" sang "${this.applicationStatusDict[newStatus]}"!`);
      return;
    }

    confirmModal(() => {
      this.changeStatus.emit({ id: row.id, status: newStatus });
    }, 'Bạn có chắc muốn thay đổi trạng thái ứng viên?', `Trạng thái sẽ được cập nhật thành "${this.applicationStatusDict[newStatus]}".`, 'question');
  }

  openSendMail(row: any) {
    this.selectedSendData = {
      fullName: row?.resume?.userDict?.fullName || '',
      email: row?.resume?.userDict?.email || '',
      title: `Thư mời ứng tuyển: ${row?.jobPostDict?.jobName}`,
      content: '',
      isSendMe: true
    };
    this.openSendMailPopup = true;
  }

  handleSendMail(formData: any) {
    this.isFullScreenLoading = true;
    this.sendEmail.emit({ ...formData, id: this.selectedSendData.id });
    this.toastr.success('Gửi email thành công!');
    this.openSendMailPopup = false;
    this.isFullScreenLoading = false;
  }

  totalPages(): number {
    return Math.ceil(this.total / this.rowsPerPage) || 1;
  }
}

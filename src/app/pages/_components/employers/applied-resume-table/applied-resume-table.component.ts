import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SweetAlertIcon } from 'sweetalert2';
import dayjs from 'dayjs';
import { confirmModal, errorModal } from '../../../../_utils/sweetalert2-modal';
import { ToastrService } from 'ngx-toastr';
import { JobPostActivityService } from '../../../../_services/job-post-activity.service';
import { SendMailCardComponent } from "../send-mail-card/send-mail-card.component";
import { NoDataCardComponent } from "../../../../_components/no-data-card/no-data-card.component";

@Component({
  selector: 'app-applied-resume-table',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SendMailCardComponent,
    NoDataCardComponent
],
  templateUrl: './applied-resume-table.component.html',
  styleUrl: './applied-resume-table.component.css'
})
export class AppliedResumeTableComponent {
  @Input() dataSource: any[] = [];
  @Input() isLoading: boolean = false;
  @Input() total: number = 0;
  @Input() page: number = 1;
  @Input() rowsPerPage: number = 10;

  @Output() delete = new EventEmitter<number>();
  @Output() changeStatus = new EventEmitter<{ id: number, status: string }>();
  @Output() sendEmail = new EventEmitter<any>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() rowsPerPageChange = new EventEmitter<number>();

  openSendMailPopup: boolean = false;
  selectedSendData: any = null;
  oldStatus: { [id: number]: string } = {};

  constructor(private router: Router) {}

  viewProfile(slug: string) {
    if (slug) {
      this.router.navigate(['/employer/profiles', slug]);
    }
  }

  onDelete(id: number) {
    confirmModal(() => {
      this.delete.emit(id);
    }, 'Bạn có chắc muốn xóa ứng viên này?', '', 'warning');
  }

  onChangeStatus(id: number, newStatus: string) {
    const currentStatus = this.oldStatus[id] || '';
    const statusOrder = ['PENDING', 'IN_PROGRESS', 'ACCEPTED', 'REJECTED'];

    if (statusOrder.indexOf(newStatus) < statusOrder.indexOf(currentStatus)) {
      errorModal('Không hợp lệ', 'Không thể thay đổi về trạng thái thấp hơn!');
      return;
    }

    confirmModal(() => {
      this.changeStatus.emit({ id, status: newStatus });
    }, 'Bạn có chắc muốn thay đổi trạng thái ứng viên?', '', 'question');
  }

  openSendMail(row: any) {
    this.selectedSendData = {
      fullName: row?.resume?.userDict?.fullName || '',
      email: row?.resume?.userDict?.email || '',
      title: `Thư mời ứng tuyển: ${row?.jobPostDict?.jobName}`,
      content: '',
      isSendMe: true,
    };
    this.openSendMailPopup = true;
  }

  handleSendMail(formData: any) {
    this.sendEmail.emit(formData);
    this.openSendMailPopup = false;
  }

  totalPages(): number {
    return Math.ceil(this.total / this.rowsPerPage) || 1;
  }

  handleChangeApplicationStatus(event: Event, row: any) {
    const target = event.target as HTMLSelectElement;
    const newStatus = target.value;
    const oldStatus = row.applicationStatus;

    const statusOrder = ['PENDING', 'IN_PROGRESS', 'ACCEPTED', 'REJECTED'];

    if (statusOrder.indexOf(newStatus) < statusOrder.indexOf(oldStatus)) {
      errorModal('Không hợp lệ', 'Không thể giảm cấp trạng thái!');
      return;
    }

    confirmModal(() => {
      this.changeStatus.emit({ id: row.id, status: newStatus });
    }, 'Bạn có chắc muốn thay đổi trạng thái ứng viên?', '', 'question');
  }

  confirmDelete(id: number) {
    confirmModal(() => {
      this.delete.emit(id);
    }, 'Bạn có chắc chắn muốn xóa ứng viên này?', '', 'warning');
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { JobService } from '../../../../_services/job.service';
import { JobPostsTableComponent } from '../job-posts-table/job-posts-table.component';
import { JobPostFormComponent } from '../job-post-form/job-post-form.component';
import { confirmModal, errorModal } from '../../../../_utils/sweetalert2-modal';
import { exportToXLSX } from '../../../../_utils/xlsx-utils';
import { JobPostFilterFormComponent } from '../job-post-filter-form/job-post-filter-form.component';

@Component({
  selector: 'app-job-post-card',
  standalone: true,
  imports: [
    CommonModule,
    JobPostsTableComponent,
    JobPostFormComponent,
    JobPostFilterFormComponent
  ],
  templateUrl: './job-post-card.component.html',
  styleUrls: ['./job-post-card.component.css']
})
export class JobPostCardComponent implements OnInit, OnDestroy {
  isLoadingList: boolean = false;
  isFullScreenLoading: boolean = false;
  openPopup: boolean = false;
  editData: any = null;
  serverErrors: any = {};

  page: number = 0;
  rowsPerPage: number = 5;
  total: number = 0;
  filterData: any = {};
  order: 'asc' | 'desc' = 'asc';
  orderBy: string = 'createAt';
  list: any[] = [];

  headCells = [
    { id: 'jobName', showOrder: true, numeric: false, disablePadding: true, label: 'Tên tin đăng' },
    { id: 'createAt', showOrder: true, numeric: false, disablePadding: false, label: 'Ngày đăng' },
    { id: 'deadline', showOrder: true, numeric: false, disablePadding: false, label: 'Thời hạn nộp' },
    { id: 'appliedTotal', showOrder: true, numeric: false, disablePadding: false, label: 'Lượt nộp' },
    { id: 'viewedTotal', showOrder: true, numeric: false, disablePadding: false, label: 'Lượt xem' },
    { id: 'isVerify', showOrder: false, numeric: false, disablePadding: false, label: 'Trạng thái' },
    { id: 'action', showOrder: false, numeric: true, disablePadding: false, label: 'Hành động' }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private jobService: JobService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchJobPosts();
  }

  fetchJobPosts() {
    this.isLoadingList = true;
    const params = {
      page: this.page + 1,
      pageSize: this.rowsPerPage,
      ordering: `${this.order === 'desc' ? '-' : ''}${this.orderBy}`,
      ...this.filterData
    };
    this.jobService.getEmployerJobPost(params).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.list = res.data.results || [];
        this.total = res.count || 0;
        this.isLoadingList = false;
      },
      error: () => {
        this.isLoadingList = false;
        errorModal('Lỗi', 'Không thể tải danh sách tin tuyển dụng');
      }
    });
  }

  onOpenCreate() {
    this.editData = null;
    this.serverErrors = {};
    this.openPopup = true;
  }

  onEdit(item: any) {
    this.isFullScreenLoading = true;
    this.jobService.getEmployerJobPostDetailById(item.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.editData = res.data || {};
        this.serverErrors = {};
        this.openPopup = true;
        this.isFullScreenLoading = false;
      },
      error: () => {
        this.isFullScreenLoading = false;
        errorModal('Lỗi', 'Không thể tải chi tiết tin tuyển dụng');
      }
    });
  }

  onDelete(item: any) {
    confirmModal(() => {
      this.isFullScreenLoading = true;
      this.jobService.deleteJobPostById(item.id).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.toast.success('Xóa tin tuyển dụng thành công');
          this.isFullScreenLoading = false;
          this.fetchJobPosts();
        },
        error: () => {
          this.isFullScreenLoading = false;
          errorModal('Lỗi', 'Xóa tin tuyển dụng thất bại');
        }
      });
    }, 'Bạn có chắc muốn xóa tin tuyển dụng này?', 'Tin tuyển dụng này sẽ được xóa vĩnh viễn và không thể khôi phục.', 'warning');
  }

  onSave(formData: any) {
    if (!formData) {
      this.openPopup = false;
      return;
    }
    const formSubmit = { ...formData };
    this.isFullScreenLoading = true;

    if (this.editData) {
      this.jobService.updateJobPostById(this.editData.id, formSubmit).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.toast.success('Cập nhật tin tuyển dụng thành công');
          this.openPopup = false;
          this.isFullScreenLoading = false;
          this.fetchJobPosts();
        },
        error: (err) => {
          this.isFullScreenLoading = false;
          this.serverErrors = err.error?.errors || { general: 'Cập nhật tin tuyển dụng thất bại' };
          errorModal('Lỗi', 'Cập nhật tin tuyển dụng thất bại');
        }
      });
    } else {
      this.jobService.addJobPost(formSubmit).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.toast.success('Tạo mới tin tuyển dụng thành công');
          this.openPopup = false;
          this.isFullScreenLoading = false;
          this.fetchJobPosts();
        },
        error: (err) => {
          this.isFullScreenLoading = false;
          this.serverErrors = err.error?.errors || { general: 'Tạo tin tuyển dụng thất bại' };
          errorModal('Lỗi', 'Tạo tin tuyển dụng thất bại');
        }
      });
    }
  }

  onCloseForm() {
    this.openPopup = false;
    this.editData = null;
    this.serverErrors = {};
  }

  onFilter(filter: any) {
    this.filterData = filter;
    this.page = 0;
    this.fetchJobPosts();
  }

  onPageChange(page: number) {
    this.page = page;
    this.fetchJobPosts();
  }

  onRowsPerPageChange(limit: number) {
    this.rowsPerPage = limit;
    this.page = 0;
    this.fetchJobPosts();
  }

  onSortChange(sortField: string) {
    if (this.orderBy === sortField) {
      this.order = this.order === 'asc' ? 'desc' : 'asc';
    } else {
      this.orderBy = sortField;
      this.order = 'asc';
    }
    this.page = 0;
    this.fetchJobPosts();
  }

  onExport() {
    if (this.list.length === 0) {
      errorModal('Lỗi', 'Không có dữ liệu để xuất');
      return;
    }

    // Chuẩn bị dữ liệu cho Excel từ this.list
    const exportData = this.list.map(item => ({
      'Tên tin': item.jobName || '',
      'Ngày đăng': item.createAt ? new Date(item.createAt).toLocaleDateString('vi-VN') : '',
      'Hạn nộp': item.deadline ? new Date(item.deadline).toLocaleDateString('vi-VN') : '',
      'Gấp': item.isUrgent ? 'Có' : 'Không',
      'Hết hạn': item.isExpired ? 'Có' : 'Không',
      'Lượt nộp': item.appliedNumber ?? item.appliedTotal ?? 0,
      'Lượt xem': item.views ?? item.viewedTotal ?? 0,
      'Trạng thái': item.isVerify ? 'Đã xác minh' : 'Chưa xác minh'
    }));

    // Xuất file Excel
    exportToXLSX(exportData, 'danh-sach-tin-tuyen-dung');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

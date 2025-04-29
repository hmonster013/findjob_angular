import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SweetAlertIcon } from 'sweetalert2';
import { JobService } from '../../../../_services/job.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { confirmModal, errorModal } from '../../../../_utils/sweetalert2-modal';
import { JobPostsTableComponent } from "../job-posts-table/job-posts-table.component";
import { JobPostFormComponent } from "../job-post-form/job-post-form.component";
import { JobPostFilterFormComponent } from "../job-post-filter-form/job-post-filter-form.component";
import { BackdropLoadingComponent } from "../../../../_components/backdrop-loading/backdrop-loading.component";
import { exportToXLSX } from '../../../../_utils/xlsx-utils';

@Component({
  selector: 'app-job-post-card',
  imports: [
    CommonModule,
    JobPostsTableComponent,
    JobPostFormComponent,
    JobPostFilterFormComponent,
    BackdropLoadingComponent
],
  templateUrl: './job-post-card.component.html',
  styleUrl: './job-post-card.component.css'
})
export class JobPostCardComponent {
  isLoadingList: boolean = false;
  isFullScreenLoading: boolean = false;
  openPopup: boolean = false;
  editData: any = null;

  page: number = 1;
  rowsPerPage: number = 10;
  total: number = 0;
  filterData: any = {};
  order: 'asc' | 'desc' = 'desc';
  orderBy: string = 'updatedAt';

  list: any[] = [];

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
      page: this.page,
      limit: this.rowsPerPage,
      order: { [this.orderBy]: this.order },
      ...this.filterData,
    };
    this.jobService.getEmployerJobPost(params).subscribe({
      next: (res) => {
        this.list = res.data || [];
        this.total = res.pagination?.total || 0;
        this.isLoadingList = false;
      },
      error: () => {
        this.isLoadingList = false;
        errorModal('Lỗi', 'Không thể load tin tuyển dụng');
      }
    });
  }

  onOpenCreate() {
    this.editData = null;
    this.openPopup = true;
  }

  onEdit(item: any) {
    this.editData = item;
    this.openPopup = true;
  }

  onDelete(item: any) {
    confirmModal(() => {
      this.isFullScreenLoading = true;
      this.jobService.deleteJobPostById(item.id).subscribe({
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
    }, 'Bạn có chắc muốn xóa tin tuyển dụng này?', '', 'warning');
  }

  onSave(formData: any) {
    const formSubmit = { ...formData };

    // Nếu các trường cần xử lý EditorState -> HTML thì xử lý ở đây
    // Ví dụ:
    // formSubmit.jobDescription = convertEditorStateToHTML(formData.jobDescription);
    // formSubmit.jobRequirement = convertEditorStateToHTML(formData.jobRequirement);

    this.isFullScreenLoading = true;

    if (this.editData) {
      this.jobService.updateJobPostById(this.editData.id, formSubmit).subscribe({
        next: () => {
          this.toast.success('Cập nhật tin tuyển dụng thành công');
          this.openPopup = false;
          this.isFullScreenLoading = false;
          this.fetchJobPosts();
        },
        error: () => {
          this.isFullScreenLoading = false;
          errorModal('Lỗi', 'Cập nhật tin tuyển dụng thất bại');
        }
      });
    } else {
      this.jobService.addJobPost(formSubmit).subscribe({
        next: () => {
          this.toast.success('Tạo mới tin tuyển dụng thành công');
          this.openPopup = false;
          this.isFullScreenLoading = false;
          this.fetchJobPosts();
        },
        error: () => {
          this.isFullScreenLoading = false;
          errorModal('Lỗi', 'Tạo tin tuyển dụng thất bại');
        }
      });
    }
  }

  onFilter(filter: any) {
    this.filterData = filter;
    this.page = 1;
    this.fetchJobPosts();
  }

  onPageChange(page: number) {
    this.page = page;
    this.fetchJobPosts();
  }

  onRowsPerPageChange(limit: number) {
    this.rowsPerPage = limit;
    this.page = 1;
    this.fetchJobPosts();
  }

  onSortChange(sortField: string) {
    if (this.orderBy === sortField) {
      this.order = this.order === 'asc' ? 'desc' : 'asc';
    } else {
      this.orderBy = sortField;
      this.order = 'asc';
    }
    this.page = 1;
    this.fetchJobPosts();
  }

  onExport() {
    const params = {
      ...this.filterData,
    };
    this.jobService.exportEmployerJobPosts(params).subscribe({
      next: (res) => {
        exportToXLSX(res.data, 'danh-sach-tin-tuyen-dung');
      },
      error: () => {
        errorModal('Lỗi', 'Xuất file thất bại');
      }
    });
  }
}

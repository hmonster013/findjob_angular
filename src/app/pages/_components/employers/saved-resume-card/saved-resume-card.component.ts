import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeSavedService } from '../../../../_services/resume-saved.service';
import { ResumeService } from '../../../../_services/resume.service';
import { ToastrService } from 'ngx-toastr';
import { errorModal, confirmModal } from '../../../../_utils/sweetalert2-modal';
import { BackdropLoadingComponent } from '../../../../_components/backdrop-loading/backdrop-loading.component';
import { exportToXLSX } from '../../../../_utils/xlsx-utils';
import { SavedResumeFilterFormComponent } from '../saved-resume-filter-form/saved-resume-filter-form.component';
import { SavedResumeTableComponent } from '../saved-resume-table/saved-resume-table.component';

@Component({
  selector: 'app-saved-resume-card',
  imports: [
    CommonModule,
    BackdropLoadingComponent,
    SavedResumeFilterFormComponent,
    SavedResumeTableComponent
  ],
  templateUrl: './saved-resume-card.component.html',
  styleUrl: './saved-resume-card.component.css'
})
export class SavedResumeCardComponent {
  resumes: any[] = [];
  isLoading: boolean = false;
  isFullScreenLoading: boolean = false;
  page: number = 1;
  rowsPerPage: number = 10;
  count: number = 0;
  filterData: any = {};
  order: any = { updatedAt: 'desc' };

  constructor(
    private resumeSavedService: ResumeSavedService,
    private resumeService: ResumeService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchResumes();
  }

  fetchResumes() {
    this.isLoading = true;

    const params = {
      ...this.filterData,
      page: this.page,
      limit: this.rowsPerPage,
      order: this.order,
    };

    this.resumeSavedService.getResumesSaved(params).subscribe({
      next: (res) => {
        this.resumes = res.data?.results || [];
        this.count = res.data?.count || 0;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        errorModal('Lỗi', 'Không thể load danh sách hồ sơ đã lưu');
      }
    });
  }

  handleFilter(filter: any) {
    this.filterData = filter;
    this.page = 1;
    this.fetchResumes();
  }

  handleChangePage(page: number) {
    this.page = page;
    this.fetchResumes();
  }

  handleChangeRowsPerPage(size: number) {
    this.rowsPerPage = size;
    this.page = 1;
    this.fetchResumes();
  }

  handleSave(slug: string) {
    confirmModal(() => {
      this.resumeService.saveResume(slug).subscribe({
        next: (res) => {
          this.toastr.success('Đã hủy lưu hồ sơ thành công');
          this.fetchResumes();
        },
        error: () => {
          errorModal('Lỗi', 'Hủy lưu hồ sơ thất bại');
        }
      });
    }, 'Bạn có chắc chắn muốn hủy lưu hồ sơ này?', '', 'warning');
  }

  handleExport() {
    this.isFullScreenLoading = true;
    this.resumeSavedService.exportResumesSaved(this.filterData).subscribe({
      next: (res) => {
        exportToXLSX(res.data, 'ho-so-da-luu');
        this.isFullScreenLoading = false;
      },
      error: (err) => {
        this.isFullScreenLoading = false;
        errorModal('Lỗi', 'Không thể xuất Excel');
      }
    });
  }

  totalPages(): number {
    return Math.ceil(this.count / this.rowsPerPage) || 1;
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeSavedService } from '../../../../_services/resume-saved.service';
import { ResumeService } from '../../../../_services/resume.service';
import { ToastrService } from 'ngx-toastr';
import { BackdropLoadingComponent } from '../../../../_components/backdrop-loading/backdrop-loading.component';
import { exportToXLSX } from '../../../../_utils/xlsx-utils';
import { SavedResumeFilterFormComponent } from '../saved-resume-filter-form/saved-resume-filter-form.component';
import { SavedResumeTableComponent } from '../saved-resume-table/saved-resume-table.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-saved-resume-card',
  standalone: true,
  imports: [
    CommonModule,
    BackdropLoadingComponent,
    SavedResumeFilterFormComponent,
    SavedResumeTableComponent
  ],
  templateUrl: './saved-resume-card.component.html',
  styleUrls: ['./saved-resume-card.component.css']
})
export class SavedResumeCardComponent implements OnInit {
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
      error: () => {
        this.isLoading = false;
        Swal.fire({
          title: 'Lỗi',
          text: 'Không thể load danh sách hồ sơ đã lưu',
          icon: 'error',
          confirmButtonText: 'Đóng',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700'
          }
        });
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
        cancelButton: 'bg-orange-200 text-orange-800 px-4 py-2 rounded-md hover:bg-orange-300 mr-2'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.resumeService.saveResume(slug).subscribe({
          next: () => {
            this.toastr.success('Đã hủy lưu hồ sơ thành công');
            this.fetchResumes();
          },
          error: () => {
            Swal.fire({
              title: 'Lỗi',
              text: 'Hủy lưu hồ sơ thất bại',
              icon: 'error',
              confirmButtonText: 'Đóng',
              buttonsStyling: false,
              customClass: {
                confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700'
              }
            });
          }
        });
      }
    });
  }

  handleExport() {
    if (this.count === 0) {
      this.toastr.warning('Không có dữ liệu để xuất!');
      return;
    }
    this.isFullScreenLoading = true;
    this.resumeSavedService.exportResumesSaved(this.filterData).subscribe({
      next: (res) => {
        exportToXLSX(res.data, 'ho-so-da-luu');
        this.isFullScreenLoading = false;
      },
      error: () => {
        this.isFullScreenLoading = false;
        Swal.fire({
          title: 'Lỗi',
          text: 'Không thể xuất Excel',
          icon: 'error',
          confirmButtonText: 'Đóng',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700'
          }
        });
      }
    });
  }

  totalPages(): number {
    return Math.ceil(this.count / this.rowsPerPage) || 1;
  }
}

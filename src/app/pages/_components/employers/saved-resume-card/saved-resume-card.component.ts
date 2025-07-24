import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ResumeSavedService } from '../../../../_services/resume-saved.service';
import { ResumeService } from '../../../../_services/resume.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { exportToXLSX } from '../../../../_utils/xlsx-utils';
import { SavedResumeFilterFormComponent } from '../saved-resume-filter-form/saved-resume-filter-form.component';
import { SavedResumeTableComponent } from '../saved-resume-table/saved-resume-table.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-saved-resume-card',
  standalone: true,
  imports: [
    CommonModule,
    SavedResumeFilterFormComponent,
    SavedResumeTableComponent,
  ],
  templateUrl: './saved-resume-card.component.html',
  styleUrls: ['./saved-resume-card.component.css'],
})
export class SavedResumeCardComponent implements OnInit, OnDestroy {
  resumes: any[] = [];
  isLoading: boolean = false;
  page: number = 1;
  rowsPerPage: number = 10;
  count: number = 0;
  filterData: any = {};
  order: any = { updatedAt: 'desc' };
  private destroy$ = new Subject<void>();

  constructor(
    private resumeSavedService: ResumeSavedService,
    private resumeService: ResumeService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.filterData = {
        kw: params['kw'] || '',
        salaryMax: params['salaryMax'] ? +params['salaryMax'] : null,
        experienceId: params['experienceId'] ? +params['experienceId'] : null,
        cityId: params['cityId'] ? +params['cityId'] : null,
      };
      this.fetchResumes();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchResumes() {
    this.isLoading = true;

    type FilterParams = {
      kw?: string;
      salaryMax?: number | null;
      experienceId?: number | null;
      cityId?: number | null;
      page: number;
      limit: number;
      order?: { updatedAt: string };
    };

    const params: FilterParams = {
      ...this.filterData,
      page: this.page,
      limit: this.rowsPerPage,
      order: this.order,
    };

    // Loại bỏ các trường null hoặc rỗng
    Object.keys(params).forEach(key => {
      if (params[key as keyof FilterParams] === null || params[key as keyof FilterParams] === '') {
        delete params[key as keyof FilterParams];
      }
    });

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
          text: 'Không thể tải danh sách hồ sơ đã lưu',
          icon: 'error',
          confirmButtonText: 'Đóng',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700',
          },
        });
      },
    });
  }

  handleFilter(filter: any) {
    this.filterData = filter;
    this.page = 1;
    const queryParams = Object.fromEntries(
      Object.entries(filter).filter(([_, v]) => v !== null && v !== '')
    );
    this.router.navigate([], { queryParams, relativeTo: this.route });
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
        cancelButton: 'bg-orange-200 text-orange-800 px-4 py-2 rounded-md hover:bg-orange-300 mr-2',
      },
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
                confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700',
              },
            });
          },
        });
      }
    });
  }

  handleExport() {
    if (this.count === 0) {
      this.toastr.warning('Không có dữ liệu để xuất!');
      return;
    }
    // Chuẩn bị dữ liệu xuất Excel từ this.resumes
    const exportData = (this.resumes || []).map((row: any) => ({
      'Tên CV': row.resume?.title || 'Chưa cập nhật',
      'Ứng viên': row.resume?.userDict?.fullName || '---',
      'Mức lương': (row.resume?.salaryMin && row.resume?.salaryMax) ? `${row.resume.salaryMin.toLocaleString('vi-VN')} - ${row.resume.salaryMax.toLocaleString('vi-VN')}` : '---',
      'Kinh nghiệm': row.resume?.experienceName || '---',
      'Thành phố': row.resume?.cityName || '---',
      'Ngày lưu': row.createAt ? new Date(row.createAt).toLocaleDateString('vi-VN') : '',
    }));
    exportToXLSX(exportData, 'ho-so-da-luu');
  }
}

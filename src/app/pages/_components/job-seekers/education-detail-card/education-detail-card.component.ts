import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { EducationDetailFormComponent } from '../education-detail-form/education-detail-form.component';
import { ResumeService } from '../../../../_services/resume.service';
import { EducationDetailService } from '../../../../_services/education-detail.service';

@Component({
  selector: 'app-education-detail-card',
  standalone: true,
  templateUrl: './education-detail-card.component.html',
  imports: [CommonModule, EducationDetailFormComponent],
})
export class EducationDetailCardComponent implements OnInit {
  educationsDetail: any[] = [];
  isLoadingEducationsDetail = true;
  isFullScreenLoading = false;
  openPopup = false;
  editData: any = null;
  resumeSlug: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private resumeService: ResumeService,
    private educationDetailService: EducationDetailService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.resumeSlug = this.route.snapshot.paramMap.get('slug');
    this.loadEducationsDetail();
  }

  loadEducationsDetail() {
    if (!this.resumeSlug) {
      this.toastr.error('Không tìm thấy hồ sơ!');
      this.isLoadingEducationsDetail = false;
      return;
    }
    this.isLoadingEducationsDetail = true;
    this.resumeService.getEducationsDetail(this.resumeSlug).subscribe({
      next: (res) => {
        this.educationsDetail = res.data || [];
      },
      error: (err) => {
        console.error('Error loading education detail:', err);
        this.toastr.error('Có lỗi khi tải danh sách học vấn!');
      },
      complete: () => {
        this.isLoadingEducationsDetail = false;
      },
    });
  }

  handleShowAdd() {
    this.editData = null;
    this.openPopup = true;
  }

  handleShowUpdate(id: number) {
    this.isFullScreenLoading = true;
    this.educationDetailService.getEducationDetailById(id).subscribe({
      next: (res) => {
        this.editData = res.data;
        this.openPopup = true;
      },
      error: (err) => {
        console.error('Error loading education detail:', err);
        this.toastr.error('Có lỗi khi tải thông tin học vấn!');
      },
      complete: () => {
        this.isFullScreenLoading = false;
      },
    });
  }

  handleAddOrUpdate = (data: any, id?: number) => {
    this.isFullScreenLoading = true;
    const payload = { ...data, resume: this.resumeSlug };
    if (id) {
      this.educationDetailService.updateEducationDetailById(id, payload).subscribe({
        next: () => {
          this.toastr.success('Cập nhật học vấn thành công!');
          this.loadEducationsDetail();
          this.openPopup = false;
        },
        error: (err) => {
          console.error('Update education detail error:', err);
          this.toastr.error(err.error?.message || 'Có lỗi khi cập nhật học vấn!');
        },
        complete: () => {
          this.isFullScreenLoading = false;
        },
      });
    } else {
      this.educationDetailService.addEducationsDetail(payload).subscribe({
        next: () => {
          this.toastr.success('Thêm học vấn thành công!');
          this.loadEducationsDetail();
          this.openPopup = false;
        },
        error: (err) => {
          console.error('Add education detail error:', err);
          this.toastr.error(err.error?.message || 'Có lỗi khi thêm học vấn!');
        },
        complete: () => {
          this.isFullScreenLoading = false;
        },
      });
    }
  };

  handleDelete(id: number) {
    Swal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc muốn xóa học vấn này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ea580c',
      cancelButtonColor: '#d1d5db',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        this.educationDetailService.deleteEducationDetailById(id).subscribe({
          next: () => {
            this.toastr.success('Xóa học vấn thành công!');
            this.loadEducationsDetail();
          },
          error: (err) => {
            console.error('Delete education detail error:', err);
            this.toastr.error('Có lỗi khi xóa học vấn!');
          },
        });
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ExperienceDetailFormComponent } from '../experience-detail-form/experience-detail-form.component';
import { ResumeService } from '../../../../_services/resume.service';
import { ExperienceDetailService } from '../../../../_services/expericen-detail.service';

@Component({
  selector: 'app-experience-detail-card',
  standalone: true,
  templateUrl: './experience-detail-card.component.html',
  imports: [CommonModule, ExperienceDetailFormComponent],
})
export class ExperienceDetailCardComponent implements OnInit {
  experiencesDetail: any[] = [];
  isLoadingExperiencesDetail = true;
  isFullScreenLoading = false;
  openPopup = false;
  editData: any = null;
  resumeSlug: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private resumeService: ResumeService,
    private experienceDetailService: ExperienceDetailService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.resumeSlug = this.route.snapshot.paramMap.get('slug');
    this.loadExperiencesDetail();
  }

  loadExperiencesDetail() {
    if (!this.resumeSlug) {
      this.toastr.error('Không tìm thấy hồ sơ!');
      this.isLoadingExperiencesDetail = false;
      return;
    }
    this.isLoadingExperiencesDetail = true;
    this.resumeService.getExperiencesDetail(this.resumeSlug).subscribe({
      next: (res) => {
        this.experiencesDetail = res.data || [];
      },
      error: (err) => {
        console.error('Error loading experiences:', err);
        this.toastr.error('Có lỗi khi tải danh sách kinh nghiệm!');
      },
      complete: () => {
        this.isLoadingExperiencesDetail = false;
      },
    });
  }

  handleShowAdd() {
    this.editData = null;
    this.openPopup = true;
  }

  handleShowUpdate(id: number) {
    this.isFullScreenLoading = true;
    this.experienceDetailService.getExperienceDetailById(id).subscribe({
      next: (res) => {
        this.editData = res.data;
        this.openPopup = true;
      },
      error: (err) => {
        console.error('Error loading experience:', err);
        this.toastr.error('Có lỗi khi tải thông tin kinh nghiệm!');
      },
      complete: () => {
        this.isFullScreenLoading = false;
      },
    });
  }

  handleAddOrUpdate = (data: any) => {
    this.isFullScreenLoading = true;
    const payload = { ...data, resume: this.resumeSlug };
    if (data.id) {
      this.experienceDetailService.updateExperienceDetailById(data.id, payload).subscribe({
        next: () => {
          this.toastr.success('Cập nhật kinh nghiệm làm việc thành công!');
          this.loadExperiencesDetail();
          this.openPopup = false;
        },
        error: (err) => {
          console.error('Error updating experience:', err);
          this.toastr.error(err.error?.message || 'Có lỗi khi cập nhật kinh nghiệm!');
        },
        complete: () => {
          this.isFullScreenLoading = false;
        },
      });
    } else {
      this.experienceDetailService.addExperienceDetail(payload).subscribe({
        next: () => {
          this.toastr.success('Thêm kinh nghiệm làm việc thành công!');
          this.loadExperiencesDetail();
          this.openPopup = false;
        },
        error: (err) => {
          console.error('Error adding experience:', err);
          this.toastr.error(err.error?.message || 'Có lỗi khi thêm kinh nghiệm!');
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
      text: 'Bạn có chắc muốn xóa kinh nghiệm làm việc này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ea580c',
      cancelButtonColor: '#d1d5db',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        this.experienceDetailService.deleteExperienceDetailById(id).subscribe({
          next: () => {
            this.toastr.success('Xóa kinh nghiệm làm việc thành công!');
            this.loadExperiencesDetail();
          },
          error: (err) => {
            console.error('Error deleting experience:', err);
            this.toastr.error('Có lỗi khi xóa kinh nghiệm!');
          },
        });
      }
    });
  }
}

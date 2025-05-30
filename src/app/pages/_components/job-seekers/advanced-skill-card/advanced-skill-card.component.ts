import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AdvancedSkillFormComponent } from '../advanced-skill-form/advanced-skill-form.component';
import { ResumeService } from '../../../../_services/resume.service';
import { AdvancedSkillService } from '../../../../_services/advanced-skill.service';

@Component({
  selector: 'app-advanced-skill-card',
  standalone: true,
  imports: [CommonModule, AdvancedSkillFormComponent],
  templateUrl: './advanced-skill-card.component.html',
})
export class AdvancedSkillCardComponent implements OnInit {
  advancedSkills: any[] = [];
  isLoadingAdvancedSkills = true;
  isFullScreenLoading = false;
  openPopup = false;
  editData: any = null;
  resumeSlug: string | null = null;

  constructor(
    private resumeService: ResumeService,
    private advancedSkillService: AdvancedSkillService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.resumeSlug = this.route.snapshot.paramMap.get('slug');
    this.loadAdvancedSkills();
  }

  loadAdvancedSkills() {
    if (!this.resumeSlug) {
      this.toastr.error('Không tìm thấy hồ sơ!');
      this.isLoadingAdvancedSkills = false;
      return;
    }
    this.isLoadingAdvancedSkills = true;
    this.resumeService.getAdvancedSkills(this.resumeSlug).subscribe({
      next: (res) => {
        this.advancedSkills = res.data || [];
      },
      error: (err) => {
        console.error('Error loading advanced skills:', err);
        this.toastr.error('Có lỗi khi tải danh sách kỹ năng!');
      },
      complete: () => {
        this.isLoadingAdvancedSkills = false;
      },
    });
  }

  handleShowAdd() {
    this.editData = null;
    this.openPopup = true;
  }

  handleShowUpdate(skillId: number) {
    this.isFullScreenLoading = true;
    this.advancedSkillService.getAdvancedSkillById(skillId).subscribe({
      next: (res) => {
        this.editData = res.data;
        this.openPopup = true;
      },
      error: (err) => {
        console.error('Error loading advanced skill:', err);
        this.toastr.error('Có lỗi khi tải thông tin kỹ năng!');
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
      this.advancedSkillService.updateAdvancedSkillById(id, payload).subscribe({
        next: () => {
          this.toastr.success('Cập nhật kỹ năng thành công!');
          this.loadAdvancedSkills();
          this.openPopup = false;
        },
        error: (err) => {
          console.error('Update error:', err);
          this.toastr.error(err.error?.message || 'Có lỗi khi cập nhật kỹ năng!');
        },
        complete: () => {
          this.isFullScreenLoading = false;
        },
      });
    } else {
      this.advancedSkillService.addAdvancedSkills(payload).subscribe({
        next: () => {
          this.toastr.success('Thêm kỹ năng thành công!');
          this.loadAdvancedSkills();
          this.openPopup = false;
        },
        error: (err) => {
          console.error('Add error:', err);
          this.toastr.error(err.error?.message || 'Có lỗi khi thêm kỹ năng!');
        },
        complete: () => {
          this.isFullScreenLoading = false;
        },
      });
    }
  };

  handleDelete(skillId: number) {
    Swal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc chắn muốn xóa kỹ năng này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ea580c',
      cancelButtonColor: '#d1d5db',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        this.advancedSkillService.deleteAdvancedSkillById(skillId).subscribe({
          next: () => {
            this.toastr.success('Xóa kỹ năng thành công!');
            this.loadAdvancedSkills();
          },
          error: (err) => {
            console.error('Delete error:', err);
            this.toastr.error('Có lỗi khi xóa kỹ năng!');
          },
        });
      }
    });
  }
}

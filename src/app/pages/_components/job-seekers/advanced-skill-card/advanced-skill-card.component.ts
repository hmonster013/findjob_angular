import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AdvancedSkillFormComponent } from '../advanced-skill-form/advanced-skill-form.component';
import { ResumeService } from '../../../../_services/resume.service';
import { AdvancedSkillService } from '../../../../_services/advanced-skill.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-advanced-skill-card',
  standalone: true,
  imports: [CommonModule, FormsModule, AdvancedSkillFormComponent],
  templateUrl: './advanced-skill-card.component.html',
  styleUrls: ['./advanced-skill-card.component.css'],
})
export class AdvancedSkillCardComponent implements OnInit {
  advancedSkills: any[] = [];
  isLoadingAdvancedSkills = true;
  isFullScreenLoading = false;
  openPopup = false;
  editData: any = null;
  serverErrors: any = null;
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
    this.serverErrors = null;
  }

  handleShowUpdate(skillId: number) {
    this.isFullScreenLoading = true;
    this.advancedSkillService.getAdvancedSkillById(skillId).subscribe({
      next: (res) => {
        this.editData = res.data;
        this.openPopup = true;
        this.serverErrors = null;
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

  handleAddOrUpdate = (data: any) => {
    this.isFullScreenLoading = true;
    if (data.id) {
      this.advancedSkillService.updateAdvancedSkillById(data.id, data).subscribe({
        next: () => {
          this.toastr.success('Cập nhật kỹ năng thành công!');
          this.loadAdvancedSkills();
          this.openPopup = false;
          this.serverErrors = null;
        },
        error: (err) => {
          console.error('Update error:', err);
          this.toastr.error('Có lỗi khi cập nhật kỹ năng!');
          this.serverErrors = err.error?.errors || null;
        },
        complete: () => {
          this.isFullScreenLoading = false;
        },
      });
    } else {
      this.advancedSkillService.addAdvancedSkills(data).subscribe({
        next: () => {
          this.toastr.success('Thêm kỹ năng thành công!');
          this.loadAdvancedSkills();
          this.openPopup = false;
          this.serverErrors = null;
        },
        error: (err) => {
          console.error('Add error:', err);
          this.toastr.error('Có lỗi khi thêm kỹ năng!');
          this.serverErrors = err.error?.errors || null;
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

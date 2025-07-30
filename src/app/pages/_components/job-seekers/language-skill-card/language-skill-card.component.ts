import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { LanguageSkillFormComponent } from '../language-skill-form/language-skill-form.component';
import { ResumeService } from '../../../../_services/resume.service';
import { LanguageSkillService } from '../../../../_services/language-skill.service';
import { CommonService } from '../../../../_services/common.service';

@Component({
  selector: 'app-language-skill-card',
  standalone: true,
  templateUrl: './language-skill-card.component.html',
  imports: [CommonModule, LanguageSkillFormComponent],
})
export class LanguageSkillCardComponent implements OnInit {
  languageSkills: any[] = [];
  isLoadingLanguageSkills = true;
  isFullScreenLoading = false;
  openPopup = false;
  editData: any = null;
  resumeSlug: string | null = null;
  allConfig: any = {};

  constructor(
    private route: ActivatedRoute,
    private resumeService: ResumeService,
    private languageSkillService: LanguageSkillService,
    private commonService: CommonService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.resumeSlug = this.route.snapshot.paramMap.get('slug');
    this.getConfigs();
    this.loadLanguageSkills();
  }

  getConfigs() {
    this.commonService.getConfigs().subscribe({
      next: (res) => {
        this.allConfig = res.data;
      },
      error: (err) => {
        this.toastr.error('Lỗi khi tải cấu hình!');
      },
    });
  }

  loadLanguageSkills() {
    if (!this.resumeSlug) {
      this.toastr.error('Không tìm thấy hồ sơ!');
      this.isLoadingLanguageSkills = false;
      return;
    }
    this.isLoadingLanguageSkills = true;
    this.resumeService.getLanguageSkills(this.resumeSlug).subscribe({
      next: (res) => {
        this.languageSkills = res.data || [];
      },
      error: (err) => {
        console.error('Error loading language skills:', err);
        this.toastr.error('Có lỗi khi tải danh sách kỹ năng ngôn ngữ!');
      },
      complete: () => {
        this.isLoadingLanguageSkills = false;
      },
    });
  }

  handleShowAdd() {
    this.editData = null;
    this.openPopup = true;
  }

  handleShowUpdate(id: number) {
    this.isFullScreenLoading = true;
    this.languageSkillService.getLanguageSkillById(id).subscribe({
      next: (res) => {
        this.editData = res.data;
        this.openPopup = true;
      },
      error: (err) => {
        console.error('Error loading language skill:', err);
        this.toastr.error('Có lỗi khi tải thông tin kỹ năng ngôn ngữ!');
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
      this.languageSkillService.updateLanguageSkillById(id, payload).subscribe({
        next: () => {
          this.toastr.success('Cập nhật kỹ năng ngôn ngữ thành công!');
          this.loadLanguageSkills();
          this.openPopup = false;
        },
        error: (err) => {
          console.error('Error updating language skill:', err);
          this.toastr.error(err.error?.message || 'Có lỗi khi cập nhật kỹ năng ngôn ngữ!');
        },
        complete: () => {
          this.isFullScreenLoading = false;
        },
      });
    } else {
      this.languageSkillService.addLanguageSkills(payload).subscribe({
        next: () => {
          this.toastr.success('Thêm kỹ năng ngôn ngữ thành công!');
          this.loadLanguageSkills();
          this.openPopup = false;
        },
        error: (err) => {
          console.error('Error adding language skill:', err);
          this.toastr.error(err.error?.message || 'Có lỗi khi thêm kỹ năng ngôn ngữ!');
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
      text: 'Bạn có chắc muốn xóa kỹ năng ngôn ngữ này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ea580c',
      cancelButtonColor: '#d1d5db',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        this.languageSkillService.deleteLanguageSkillById(id).subscribe({
          next: () => {
            this.toastr.success('Xóa kỹ năng ngôn ngữ thành công!');
            this.loadLanguageSkills();
          },
          error: (err) => {
            console.error('Error deleting language skill:', err);
            this.toastr.error('Có lỗi khi xóa kỹ năng ngôn ngữ!');
          },
        });
      }
    });
  }
}

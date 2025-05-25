import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-search.component.html',
  styleUrls: ['./profile-search.component.css']
})
export class ProfileSearchComponent {
  @Output() search = new EventEmitter<any>();
  @Output() reset = new EventEmitter<void>();

  searchForm: FormGroup;

  careers: any[] = [
    { value: '', label: 'Chọn ngành nghề' },
    { value: 'IT', label: 'IT' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Bán hàng', label: 'Bán hàng' }
  ];

  experiences: any[] = [
    { value: '', label: 'Chọn kinh nghiệm' },
    { value: '0', label: 'Chưa có kinh nghiệm' },
    { value: '1', label: '1 năm' },
    { value: '2', label: '2 năm' },
    { value: '3', label: '3 năm' },
    { value: '4', label: '4 năm' },
    { value: '5', label: '5 năm' },
    { value: '6', label: 'Trên 5 năm' }
  ];

  positions: any[] = [
    { value: '', label: 'Chọn vị trí' },
    { value: 'Nhân viên', label: 'Nhân viên' },
    { value: 'Trưởng nhóm', label: 'Trưởng nhóm' },
    { value: 'Quản lý', label: 'Quản lý' }
  ];

  academicLevels: any[] = [
    { value: '', label: 'Chọn trình độ' },
    { value: 'Cao đẳng', label: 'Cao đẳng' },
    { value: 'Đại học', label: 'Đại học' },
    { value: 'Sau đại học', label: 'Sau đại học' }
  ];

  workplaces: any[] = [
    { value: '', label: 'Chọn hình thức' },
    { value: 'onsite', label: 'Làm tại công ty' },
    { value: 'remote', label: 'Làm từ xa' }
  ];

  jobTypes: any[] = [
    { value: '', label: 'Chọn loại công việc' },
    { value: 'fulltime', label: 'Toàn thời gian' },
    { value: 'parttime', label: 'Bán thời gian' }
  ];

  genders: any[] = [
    { value: '', label: 'Chọn giới tính' },
    { value: 'male', label: 'Nam' },
    { value: 'female', label: 'Nữ' },
    { value: 'other', label: 'Khác' }
  ];

  maritalStatuses: any[] = [
    { value: '', label: 'Chọn tình trạng' },
    { value: 'single', label: 'Độc thân' },
    { value: 'married', label: 'Đã kết hôn' }
  ];

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      career: [''],
      experience: [''],
      position: [''],
      academicLevel: [''],
      workplace: [''],
      jobType: [''],
      gender: [''],
      maritalStatus: ['']
    });
  }

  onSubmit() {
    if (this.searchForm.valid) {
      const formValue = { ...this.searchForm.value };
      // Remove empty values
      Object.keys(formValue).forEach((key) => {
        if (formValue[key] === '' || formValue[key] === null) {
          delete formValue[key];
        }
      });
      this.search.emit(formValue);
    } else {
      Swal.fire({
        title: 'Cảnh báo',
        text: 'Vui lòng nhập dữ liệu hợp lệ!',
        icon: 'warning',
        confirmButtonText: 'Đóng',
        buttonsStyling: false,
        customClass: {
          confirmButton: 'bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700'
        }
      });
    }
  }

  onReset() {
    this.searchForm.reset();
    this.reset.emit();
  }

  isFormEmpty(): boolean {
    return Object.values(this.searchForm.value).every(value => !value);
  }
}

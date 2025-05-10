import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-search.component.html'
})
export class ProfileSearchComponent {
  @Output() search = new EventEmitter<any>();
  @Output() reset = new EventEmitter<void>();

  searchForm: FormGroup;

  // Configurable options
  cities: any[] = [
    { value: '', label: 'Chọn tỉnh/thành phố' },
    { value: 'Hà Nội', label: 'Hà Nội' },
    { value: 'Hồ Chí Minh', label: 'Hồ Chí Minh' },
    { value: 'Đà Nẵng', label: 'Đà Nẵng' }
  ];

  careers: any[] = [
    { value: '', label: 'Chọn ngành nghề' },
    { value: 'IT', label: 'IT' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Bán hàng', label: 'Bán hàng' }
  ];

  experiences: any[] = [
    { value: '', label: 'Kinh nghiệm' },
    { value: '0', label: 'Chưa có kinh nghiệm' },
    { value: '1', label: '1 năm' },
    { value: '2', label: '2 năm' },
    { value: '3', label: '3 năm' },
    { value: '4', label: '4 năm' },
    { value: '5', label: '5 năm' },
    { value: '6', label: 'Trên 5 năm' }
  ];

  positions: any[] = [
    { value: '', label: 'Vị trí mong muốn' },
    { value: 'Nhân viên', label: 'Nhân viên' },
    { value: 'Trưởng nhóm', label: 'Trưởng nhóm' },
    { value: 'Quản lý', label: 'Quản lý' }
  ];

  academicLevels: any[] = [
    { value: '', label: 'Trình độ học vấn' },
    { value: 'Cao đẳng', label: 'Cao đẳng' },
    { value: 'Đại học', label: 'Đại học' },
    { value: 'Sau đại học', label: 'Sau đại học' }
  ];

  workplaces: any[] = [
    { value: '', label: 'Hình thức làm việc' },
    { value: 'onsite', label: 'Làm tại công ty' },
    { value: 'remote', label: 'Làm từ xa' }
  ];

  jobTypes: any[] = [
    { value: '', label: 'Loại công việc' },
    { value: 'fulltime', label: 'Toàn thời gian' },
    { value: 'parttime', label: 'Bán thời gian' }
  ];

  genders: any[] = [
    { value: '', label: 'Giới tính' },
    { value: 'male', label: 'Nam' },
    { value: 'female', label: 'Nữ' },
    { value: 'other', label: 'Khác' }
  ];

  maritalStatuses: any[] = [
    { value: '', label: 'Tình trạng hôn nhân' },
    { value: 'single', label: 'Độc thân' },
    { value: 'married', label: 'Đã kết hôn' }
  ];

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      keyword: ['', [Validators.maxLength(100)]],
      city: [''],
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
      this.search.emit(this.searchForm.value);
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

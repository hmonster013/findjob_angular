import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-post-notification-form',
  standalone: true,
  templateUrl: './job-post-notification-form.component.html',
  styleUrls: ['./job-post-notification-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class JobPostNotificationFormComponent implements OnInit, OnChanges {
  @Input() editData: any = null;
  @Input() handleAddOrUpdate!: (data: any) => void;
  @Input() allConfig: any = {};

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      jobName: ['', [Validators.required, Validators.maxLength(200)]],
      career: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Phải là số
      city: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Phải là số
      position: [''],
      experience: [''],
      salary: [null, [Validators.min(0)]], // Chấp nhận null, kiểm tra số dương
      frequency: ['', Validators.required], // Bắt buộc
    });

    // Đặt giá trị mặc định cho frequency
    const defaultFrequency = (this.allConfig?.frequencyNotificationOptions || [])[0]?.id || '';
    this.form.patchValue({ frequency: defaultFrequency });

    // Patch editData nếu có
    if (this.editData) {
      this.form.patchValue({
        ...this.editData,
        salary: this.editData.salary || null, // Chuyển chuỗi rỗng thành null
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['editData'] && !changes['editData'].firstChange) {
      if (this.editData) {
        this.form.patchValue({
          ...this.editData,
          salary: this.editData.salary || null, // Chuyển chuỗi rỗng thành null
        });
      } else {
        this.form.reset({
          jobName: '',
          career: '',
          city: '',
          position: '',
          experience: '',
          salary: null,
          frequency: (this.allConfig?.frequencyNotificationOptions || [])[0]?.id || '',
        });
      }
    }
  }

  onSubmit() {
    if (this.form.valid && this.handleAddOrUpdate) {
      const formValue = {
        ...this.form.value,
        salary: this.form.value.salary || null, // Chuyển chuỗi rỗng thành null
      };
      this.handleAddOrUpdate(formValue);
    }
  }
}

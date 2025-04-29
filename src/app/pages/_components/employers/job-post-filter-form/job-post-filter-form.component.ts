import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-post-filter-form',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './job-post-filter-form.component.html',
  styleUrl: './job-post-filter-form.component.css'
})
export class JobPostFilterFormComponent {
  @Output() filter = new EventEmitter<any>();

  form: FormGroup;

  urgentOptions = [
    { id: 1, name: 'Tuyển gấp' },
    { id: 2, name: 'Không tuyển gấp' }
  ];

  statusOptions: any[] = []; // Sẽ cần truyền vào hoặc lấy từ service, placeholder để đó

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      kw: [''],
      isUrgent: [''],
      statusId: ['']
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.filter.emit(this.form.value);
    }
  }

  onReset() {
    this.form.reset();
    this.filter.emit(this.form.value);
  }
}

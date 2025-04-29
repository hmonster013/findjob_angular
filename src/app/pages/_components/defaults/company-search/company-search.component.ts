import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-search',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './company-search.component.html',
  styleUrl: './company-search.component.css'
})
export class CompanySearchComponent {
  @Output() search = new EventEmitter<any>();
  @Output() resetSearch = new EventEmitter<void>();

  form: FormGroup;

  cityOptions = [
    { id: 1, name: 'Hồ Chí Minh' },
    { id: 2, name: 'Hà Nội' },
    { id: 3, name: 'Đà Nẵng' },
    // 🔥 bạn thay danh sách thành data API sau nhé
  ];

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      kw: [''],
      cityId: ['']
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const data = this.form.value;
      this.search.emit(data); // gửi lên parent nếu cần
      // hoặc Navigate luôn:
      this.router.navigate(['/cong-ty'], { queryParams: data });
    }
  }

  onReset() {
    this.form.reset();
    this.resetSearch.emit();
    this.router.navigate(['/cong-ty']);
  }
}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../../../_services/common.service';

@Component({
  selector: 'app-company-search',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './company-search.component.html',
  styleUrl: './company-search.component.css'
})
export class CompanySearchComponent implements OnInit {
  @Output() search = new EventEmitter<any>();
  @Output() resetSearch = new EventEmitter<void>();

  form: FormGroup;

  cityOptions: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private commonService: CommonService,
  ) {
    this.form = this.fb.group({
      kw: [''],
      cityId: ['']
    });
  }

  ngOnInit(): void {
    this.commonService.getCities().subscribe({
      next: (res) => {
        this.cityOptions = res.data || [];
      }
    })
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

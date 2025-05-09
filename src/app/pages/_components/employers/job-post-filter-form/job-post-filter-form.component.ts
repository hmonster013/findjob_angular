import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from '../../../../_services/common.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-job-post-filter-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './job-post-filter-form.component.html',
  styleUrls: ['./job-post-filter-form.component.css']
})
export class JobPostFilterFormComponent implements OnInit {
  @Output() filter = new EventEmitter<any>();

  form: FormGroup;
  urgentOptions = [
    { id: 1, name: 'Tuyển gấp' },
    { id: 2, name: 'Không tuyển gấp' }
  ];
  statusOptions: any[] = [];
  destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private commonService: CommonService) {
    this.form = this.fb.group({
      kw: [''],
      isUrgent: [''],
      statusId: ['']
    });
  }

  ngOnInit(): void {
    this.fetchStatusOptions();
  }

  fetchStatusOptions() {
    // Giả định CommonService có API để lấy job post status
    this.commonService.getConfigs().pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.statusOptions = res.data?.jobPostStatusOptions || [];
    });
  }

  onSubmit() {
    this.filter.emit(this.form.value);
  }

  onReset() {
    this.form.reset({ kw: '', isUrgent: '', statusId: '' });
    this.filter.emit(this.form.value);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

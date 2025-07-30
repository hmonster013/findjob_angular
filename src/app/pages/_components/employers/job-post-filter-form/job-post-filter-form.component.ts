import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from '../../../../_services/common.service';
import { Subject, takeUntil } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-job-post-filter-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './job-post-filter-form.component.html',
  styleUrls: ['./job-post-filter-form.component.css']
})
export class JobPostFilterFormComponent implements OnInit, OnDestroy {
  @Output() filter = new EventEmitter<any>();

  form: FormGroup;
  isLoading: boolean = false;
  urgentOptions = [
    { id: 1, name: 'Tuyển gấp' },
    { id: 2, name: 'Không tuyển gấp' }
  ];
  statusOptions: any[] = [];

  destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      kw: [''],
      isUrgent: [''],
      statusId: ['']
    });
  }

  ngOnInit(): void {
    this.fetchStatusOptions();
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.form.patchValue({
        kw: params['kw'] || '',
        isUrgent: params['isUrgent'] || '',
        statusId: params['statusId'] || ''
      });
      this.onSubmit();
    });
  }

  fetchStatusOptions() {
    this.commonService.getConfigs().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.statusOptions = res.data?.jobPostStatusOptions || [];
      },
      error: (err) => {
        console.error('Lỗi tải trạng thái:', err);
      }
    });
  }

  handleSaveKeywordLocalStorage(kw: string) {
    try {
      if (kw) {
        const keywordListStr = localStorage.getItem('job_post_filter_history');
        let keywordList = keywordListStr ? JSON.parse(keywordListStr) : [];
        if (!keywordList.includes(kw)) {
          if (keywordList.length >= 5) {
            keywordList = [kw, ...keywordList.slice(0, 4)];
          } else {
            keywordList = [kw, ...keywordList];
          }
          localStorage.setItem('job_post_filter_history', JSON.stringify(keywordList));
        }
      }
    } catch (error) {
      console.error('Lỗi khi lưu từ khóa:', error);
    }
  }

  onSubmit() {
    this.isLoading = true;
    const data = this.form.value;
    this.handleSaveKeywordLocalStorage(data.kw);
    const filterData = {
      ...data,
      isUrgent: data.isUrgent === '1' ? true : data.isUrgent === '2' ? false : ''
    };
    this.filter.emit(filterData);
    const queryParams = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== '' && v !== null)
    );
    this.router.navigate([], { queryParams, relativeTo: this.route });

    // Reset loading state after a short delay
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  onReset() {
    this.form.reset({ kw: '', isUrgent: '', statusId: '' });
    this.filter.emit(this.form.value);
    this.router.navigate([], { queryParams: {}, relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

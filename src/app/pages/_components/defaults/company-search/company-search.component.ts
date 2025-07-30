import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../../_services/common.service';
import { ROUTES } from '../../../../_configs/constants';

@Component({
  selector: 'app-company-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './company-search.component.html',
  styleUrls: ['./company-search.component.css']
})
export class CompanySearchComponent implements OnInit {
  form: FormGroup;
  cityOptions: any[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.form = this.fb.group({
      kw: [''],
      cityId: ['']
    });
  }

  ngOnInit(): void {
    this.getConfigs();
    this.route.queryParams.subscribe(params => {
      this.form.patchValue({
        kw: params['kw'] || '',
        cityId: params['cityId'] || ''
      });
    });
  }

  getConfigs() {
    this.commonService.getConfigs().subscribe({
      next: (res) => {
        this.cityOptions = res.data.cityOptions || [];
      },
      error: (err) => {
        console.error('Lỗi tải cấu hình:', err);
      }
    });
  }

  handleSaveKeywordLocalStorage(kw: string) {
    try {
      if (kw) {
        const keywordListStr = localStorage.getItem('company_search_history');
        let keywordList = keywordListStr ? JSON.parse(keywordListStr) : [];
        if (!keywordList.includes(kw)) {
          if (keywordList.length >= 5) {
            keywordList = [kw, ...keywordList.slice(0, 4)];
          } else {
            keywordList = [kw, ...keywordList];
          }
          localStorage.setItem('company_search_history', JSON.stringify(keywordList));
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

    const queryParams = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== '' && v !== null)
    );

    this.router.navigate([ROUTES.JOB_SEEKER.COMPANY], { queryParams })
      .finally(() => this.isLoading = false);
  }

  onReset() {
    this.form.reset();
    this.router.navigate([ROUTES.JOB_SEEKER.COMPANY], { queryParams: {} });
  }

  isFormNotEmpty(): boolean {
    const values = this.form.value;
    return Object.values(values).some(value => value !== '' && value !== null);
  }
}

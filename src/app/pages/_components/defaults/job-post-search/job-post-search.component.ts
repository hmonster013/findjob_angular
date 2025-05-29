import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../../_services/common.service';
import { CommonModule } from '@angular/common';
import { ROUTES } from '../../../../_configs/constants';

@Component({
  selector: 'app-job-post-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './job-post-search.component.html',
  styleUrls: ['./job-post-search.component.css']
})
export class JobPostSearchComponent implements OnInit {
  form: FormGroup;
  showAdvanceFilter = false;
  careerOptions: any[] = [];
  cityOptions: any[] = [];
  positionOptions: any[] = [];
  experienceOptions: any[] = [];
  jobTypeOptions: any[] = [];
  typeOfWorkplaceOptions: any[] = [];
  genderOptions: any[] = [];
  ROUTES = ROUTES;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.form = this.fb.group({
      kw: [''],
      careerId: [''],
      cityId: [''],
      positionId: [''],
      experienceId: [''],
      jobTypeId: [''],
      typeOfWorkplaceId: [''],
      genderId: ['']
    });
  }

  ngOnInit(): void {
    this.getConfigs();
    this.route.queryParams.subscribe(params => {
      this.form.patchValue({
        kw: params['kw'] || '',
        careerId: params['careerId'] || '',
        cityId: params['cityId'] || '',
        positionId: params['positionId'] || '',
        experienceId: params['experienceId'] || '',
        jobTypeId: params['jobTypeId'] || '',
        typeOfWorkplaceId: params['typeOfWorkplaceId'] || '',
        genderId: params['genderId'] || ''
      });
      if (Object.values(params).some(val => val)) {
        this.showAdvanceFilter = true;
      }
    });
  }

  getConfigs() {
    this.commonService.getConfigs().subscribe({
      next: (res) => {
        this.careerOptions = res.data.careerOptions || [];
        this.cityOptions = res.data.cityOptions || [];
        this.positionOptions = res.data.positionOptions || [];
        this.experienceOptions = res.data.experienceOptions || [];
        this.jobTypeOptions = res.data.jobTypeOptions || [];
        this.typeOfWorkplaceOptions = res.data.typeOfWorkplaceOptions || [];
        this.genderOptions = res.data.genderOptions || [];
      },
      error: (err) => {
        console.error('Error fetching configs:', err);
      }
    });
  }

  handleSaveKeywordLocalStorage(kw: string) {
    try {
      if (kw) {
        const keywordListStr = localStorage.getItem('myjob_search_history');
        let keywordList = keywordListStr ? JSON.parse(keywordListStr) : [];
        if (!keywordList.includes(kw)) {
          if (keywordList.length >= 5) {
            keywordList = [kw, ...keywordList.slice(0, 4)];
          } else {
            keywordList = [kw, ...keywordList];
          }
          localStorage.setItem('myjob_search_history', JSON.stringify(keywordList));
        }
      }
    } catch (error) {
      console.error('Lỗi khi lưu từ khóa:', error);
    }
  }

  onSubmit() {
    const data = this.form.value;
    this.handleSaveKeywordLocalStorage(data.kw);
    this.router.navigate([ROUTES.JOB_SEEKER.JOBS], { queryParams: data });
  }

  onReset() {
    this.form.reset();
    this.router.navigate([ROUTES.JOB_SEEKER.JOBS], { queryParams: {} });
  }

  toggleAdvanceFilter() {
    this.showAdvanceFilter = !this.showAdvanceFilter;
  }

  isFormNotEmpty(): boolean {
    const values = this.form.value;
    return Object.values(values).some(value => value !== '' && value !== null);
  }
}

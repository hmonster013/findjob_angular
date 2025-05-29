import { CommonService } from './../../../../_services/common.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ROUTES } from '../../../../_configs/constants';

@Component({
  selector: 'app-job-by-category',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './job-by-category.component.html',
  styleUrl: './job-by-category.component.css'
})
export class JobByCategoryComponent implements OnInit{
  careerOptions: any[] = [];
  cityOptions: any[] = [];
  jobTypeOptions: any[] = [];

  readonly maxItem = 6;

  ROUTES = ROUTES;

  constructor(
    private router: Router,
    private commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.getConfig();
  }

  getConfig() {
    this.commonService.getConfigs().subscribe({
      next: (res) => {
        this.careerOptions = res.data.careerOptions;
        this.cityOptions = res.data.cityOptions;
        this.jobTypeOptions = res.data.jobTypeOptions;
      },
      error: (err) => {

      }
    })
  }

  handleFilter(id: number, type: 'CAREER' | 'CITY' | 'JOB_TYPE') {
    const queryParams: any = {};
    switch (type) {
      case 'CAREER':
        queryParams['careerId'] = id;
        break;
      case 'CITY':
        queryParams['cityId'] = id;
        break;
      case 'JOB_TYPE':
        queryParams['jobTypeId'] = id;
        break;
    }
    this.router.navigate([`/${ROUTES.JOB_SEEKER.JOBS}`], { queryParams });
  }
}

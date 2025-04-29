import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
export class JobByCategoryComponent {
  ROUTES = ROUTES;

  constructor(private router: Router) {}

  careerOptions = [
    { id: 1, name: 'Công nghệ thông tin' },
    { id: 2, name: 'Kế toán' },
    { id: 3, name: 'Marketing' },
    { id: 4, name: 'Xây dựng' },
    { id: 5, name: 'Ngân hàng' },
    { id: 6, name: 'Bán hàng' },
  ];

  cityOptions = [
    { id: 1, name: 'Hồ Chí Minh' },
    { id: 2, name: 'Hà Nội' },
    { id: 3, name: 'Đà Nẵng' },
    { id: 4, name: 'Hải Phòng' },
    { id: 5, name: 'Cần Thơ' },
    { id: 6, name: 'Bình Dương' },
  ];

  jobTypeOptions = [
    { id: 1, name: 'Toàn thời gian' },
    { id: 2, name: 'Bán thời gian' },
    { id: 3, name: 'Remote' },
    { id: 4, name: 'Thực tập' },
    { id: 5, name: 'Hợp đồng' },
    { id: 6, name: 'Tự do' },
  ];

  readonly maxItem = 6;

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

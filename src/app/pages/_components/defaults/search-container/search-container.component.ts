import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CommonService } from '../../../../_services/common.service';
import { Router } from '@angular/router';
import { HomeSearchComponent } from '../home-search/home-search.component';
import { IMAGES, ROUTES } from '../../../../_configs/constants';

@Component({
  selector: 'app-search-container',
  standalone: true,
  imports: [
    CommonModule,
    HomeSearchComponent
  ],
  templateUrl: './search-container.component.html',
  styleUrls: ['./search-container.component.css']
})
export class SearchContainerComponent {
  topCareers: any[] = [];
  IMAGES = IMAGES;

  constructor(
    private commonService: CommonService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getTopCareers();
  }

  getTopCareers() {
    this.commonService.getTop10Careers().subscribe({
      next: (res) => {
        this.topCareers = res.data;
      },
      error: (error) => {
        console.error('Lỗi tải top careers:', error);
      }
    });
  }

  handleFilter(careerId?: number) {
    const queryParams = careerId ? { careerId } : {};
    this.router.navigate([`/${ROUTES.JOB_SEEKER.JOBS}`], { queryParams });
  }

  handleGetAllCareets() {
    this.router.navigate([`/${ROUTES.JOB_SEEKER.JOBS_BY_CAREER}`]);
  }
}

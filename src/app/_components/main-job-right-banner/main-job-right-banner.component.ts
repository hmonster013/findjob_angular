import { Component } from '@angular/core';
import { MyjobService } from '../../_services/myjob.service';
import { BANNER_TYPES } from '../../_configs/constants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-job-right-banner',
  imports: [
    CommonModule
  ],
  templateUrl: './main-job-right-banner.component.html',
  styleUrl: './main-job-right-banner.component.css'
})
export class MainJobRightBannerComponent {
  rightBanners: any[] = [];

  constructor(private myjobService: MyjobService) {}

  ngOnInit() {
    this.fetchBanners();
  }

  fetchBanners() {
    this.myjobService.getBanners({ type: BANNER_TYPES.MAIN_JOB_RIGHT }).subscribe({
      next: (res) => {
        this.rightBanners = res.data || [];
      },
      error: (err) => {
        console.error('Lỗi load banner:', err);
      }
    });
  }
}

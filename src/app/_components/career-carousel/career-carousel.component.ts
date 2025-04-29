import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HOME_FILTER_CAREER } from '../../_configs/constants';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../_services/common.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-career-carousel',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './career-carousel.component.html',
  styleUrl: './career-carousel.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CareerCarouselComponent {
  isLoading = true;
  topCareers: { id: number; name: string; imageUrl: string }[] = [];
  slidesPerView = 5;

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.fetchTopCareers();
    this.handleResize();
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  fetchTopCareers(): void {
    this.isLoading = true;
    this.commonService.getTop10Careers().subscribe({
      next: (res) => {
        this.topCareers = res.data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  handleResize(): void {
    const width = window.innerWidth;
    if (width < 600) {
      this.slidesPerView = 2;
    } else if (width < 900) {
      this.slidesPerView = 3;
    } else if (width < 1200) {
      this.slidesPerView = 4;
    } else {
      this.slidesPerView = 5;
    }
  }
}

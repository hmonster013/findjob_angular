import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';

@Component({
  selector: 'app-company-highlight',
  imports: [
    CommonModule
  ],
  templateUrl: './company-highlight.component.html',
  styleUrl: './company-highlight.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CareerCarouselComponent {
  isLoading = true;
  topCareers: any[] = [];
  slidesPerView = 5;

  ngOnInit(): void {
    this.loadData();
    this.updateSlides();
    window.addEventListener('resize', this.updateSlides.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.updateSlides.bind(this));
  }

  updateSlides() {
    const width = window.innerWidth;
    if (width < 640) {
      this.slidesPerView = 2;
    } else if (width < 900) {
      this.slidesPerView = 3;
    } else if (width < 1200) {
      this.slidesPerView = 4;
    } else {
      this.slidesPerView = 5; // luôn 5 card desktop
    }
  }

  loadData() {
    setTimeout(() => {
      this.topCareers = [
        { id: 1, name: 'Công Ty TNHH Sản Xuất Vôi', iconUrl: '' },
        { id: 2, name: 'Công Ty TNHH Dịch Vụ Du Lịch', iconUrl: '' },
        { id: 3, name: 'Công Ty Cổ Phần Ipos.VN', iconUrl: '' },
        { id: 4, name: 'Nail Spa Supply (NSS)', iconUrl: '' },
        { id: 5, name: 'Công Ty Cổ Phần Bảo Gia', iconUrl: '' },
        { id: 6, name: 'Công Ty Cổ Phần XYZ', iconUrl: '' },
        { id: 7, name: 'Công Ty ABC Việt Nam', iconUrl: '' },
      ];
      this.isLoading = false;
    }, 1000);
  }
}

import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FindjobService } from '../../../../_services/myjob.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-top-slide',
  imports: [
    CommonModule
  ],
  templateUrl: './top-slide.component.html',
  styleUrl: './top-slide.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TopSlideComponent {
  banners: any[] = [];

  constructor(private myjobService: FindjobService) {}

  ngOnInit() {
    this.getBanners();
  }

  getBanners() {
    this.myjobService.getBanners({ type: 'HOME' }).subscribe({
      next: (res) => {
        this.banners = res?.data || [];
      },
      error: (error) => {
        console.error('Lỗi load banners:', error);
      }
    });
  }
}

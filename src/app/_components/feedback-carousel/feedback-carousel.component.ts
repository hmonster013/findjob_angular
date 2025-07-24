import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener } from '@angular/core';
import { FindjobService } from '../../_services/myjob.service';
import { FeedbackCardComponent } from '../feedback-card/feedback-card.component';
import { NoDataCardComponent } from '../no-data-card/no-data-card.component';

@Component({
  selector: 'app-feedback-carousel',
  imports: [
    CommonModule,
    FeedbackCardComponent,
    NoDataCardComponent,
  ],
  templateUrl: './feedback-carousel.component.html',
  styleUrl: './feedback-carousel.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FeedbackCarouselComponent {
  feedbacks: any[] = [];
  isLoading: boolean = true;
  col: number = 4;
  skeletonArray = Array(10);

  constructor(private myjobService: FindjobService) {}

  ngOnInit() {
    this.handleResize();
    this.fetchFeedbacks();
  }

  @HostListener('window:resize')
  handleResize() {
    const width = window.innerWidth;
    if (width < 600) {
      this.col = 1;
    } else if (width < 900) {
      this.col = 2;
    } else if (width < 1200) {
      this.col = 3;
    } else {
      this.col = 4;
    }
  }

  fetchFeedbacks() {
    this.isLoading = true;
    this.myjobService.getFeedbacks().subscribe({
      next: (res) => {
        this.feedbacks = res.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi lấy feedback:', err);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}

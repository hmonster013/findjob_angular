import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { TopCompanyCarouselComponent } from '../../../_components/top-company-carousel/top-company-carousel.component';
import { FeedbackCarouselComponent } from '../../../_components/feedback-carousel/feedback-carousel.component';
import { FilterJobPostCardComponent } from '../../_components/defaults/filter-job-post-card/filter-job-post-card.component';
import { JobByCategoryComponent } from '../../_components/defaults/job-by-category/job-by-category.component';
import { SuggestedJobPostCardComponent } from '../../_components/defaults/suggested-job-post-card/suggested-job-post-card.component';
import { HOME_FILTER_CAREER, ROLES_NAME, ROUTES } from '../../../_configs/constants';
import { AuthStateService } from '../../../_services/auth-state.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgIf,
    TopCompanyCarouselComponent,
    FeedbackCarouselComponent,
    JobByCategoryComponent,
    FilterJobPostCardComponent,
    SuggestedJobPostCardComponent
],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  readonly HOME_FILTER_CAREER = HOME_FILTER_CAREER;
  readonly ROUTES = ROUTES;
  isJobSeeker = false;

  constructor(
    private router: Router,
    private authService: AuthStateService,
  ) {
    this.authService.getAuthStatus().subscribe(() => {
      const currentUser = this.authService.getCurrentUser();
      this.isJobSeeker = this.authService.isAuthenticated() &&
                         currentUser?.roleName === ROLES_NAME.JOB_SEEKER;
    });
  }

  navigateToJobs() {
    this.router.navigate([`/${this.ROUTES.JOB_SEEKER.JOBS}`]);
  }
}

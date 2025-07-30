import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarProfileComponent } from '../../_components/job-seekers/sidebar-profile/sidebar-profile.component';
import { SidebarViewTotalComponent } from '../../_components/job-seekers/sidebar-view-total/sidebar-view-total.component';
import { JobApplicationCardComponent } from '../../_components/job-seekers/job-application-card/job-application-card.component';
import { JobSeekerQuantityStatisticsComponent } from '../../_components/job-seekers/job-seeker-quantity-statistics/job-seeker-quantity-statistics.component';
import { ActivityChartComponent } from '../../_components/job-seekers/activity-chart/activity-chart.component';
import { SuggestedJobPostCardComponent } from '../../_components/defaults/suggested-job-post-card/suggested-job-post-card.component';
import { AuthStateService } from '../../../_services/auth-state.service';

@Component({
  selector: 'app-dashboard-jobseeker-page',
  standalone: true,
  imports: [
    CommonModule,
    SidebarProfileComponent,
    SidebarViewTotalComponent,
    JobApplicationCardComponent,
    JobSeekerQuantityStatisticsComponent,
    ActivityChartComponent,
    SuggestedJobPostCardComponent,
  ],
  templateUrl: './dashboard-jobseeker-page.component.html',
})
export class DashboardJobSeekerPageComponent {
  currentUser: any;

  constructor(
    private authStateService: AuthStateService,
  ){
    this.currentUser = authStateService.getCurrentUser();
  }
}

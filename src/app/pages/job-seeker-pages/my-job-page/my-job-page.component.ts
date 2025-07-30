import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SavedJobCardComponent } from '../../_components/job-seekers/saved-job-card/saved-job-card.component';
import { AppliedJobCardComponent } from '../../_components/job-seekers/applied-job-card/applied-job-card.component';
import { JobPostNotificationCardComponent } from '../../_components/job-seekers/job-post-notification-card/job-post-notification-card.component';
import { SuggestedJobPostCardComponent } from '../../_components/defaults/suggested-job-post-card/suggested-job-post-card.component';

@Component({
  selector: 'app-my-job-page',
  standalone: true,
  imports: [
    CommonModule,
    SavedJobCardComponent,
    AppliedJobCardComponent,
    JobPostNotificationCardComponent,
    SuggestedJobPostCardComponent,
  ],
  templateUrl: './my-job-page.component.html',
})
export class MyJobPageComponent {
  selectedTab: 'saved' | 'applied' | 'notified' = 'saved';

  selectTab(tab: 'saved' | 'applied' | 'notified') {
    this.selectedTab = tab;
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyViewedCardComponent } from '../../_components/job-seekers/company-viewed-card/company-viewed-card.component';
import { CompanyFollowedCardComponent } from '../../_components/job-seekers/company-followed-card/company-followed-card.component';
import { SuggestedJobPostCardComponent } from '../../_components/defaults/suggested-job-post-card/suggested-job-post-card.component';

@Component({
  selector: 'app-my-company-page',
  standalone: true,
  imports: [
    CommonModule,
    CompanyViewedCardComponent,
    CompanyFollowedCardComponent,
    SuggestedJobPostCardComponent,
  ],
  templateUrl: './my-company-page.component.html',
})
export class MyCompanyPageComponent {
  selectedTab: 'viewed' | 'followed' = 'viewed';

  selectTab(tab: 'viewed' | 'followed') {
    this.selectedTab = tab;
  }
}

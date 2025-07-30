import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobPostSearchComponent } from '../../_components/defaults/job-post-search/job-post-search.component';
import { MainJobPostCardComponent } from '../../_components/defaults/main-job-post-card/main-job-post-card.component';
import { SuggestedJobPostCardComponent } from '../../_components/defaults/suggested-job-post-card/suggested-job-post-card.component';
import { MainJobRightBannerComponent } from '../../../_components/main-job-right-banner/main-job-right-banner.component';

@Component({
  selector: 'app-job-page',
  standalone: true,
  imports: [
    CommonModule,
    JobPostSearchComponent,
    MainJobPostCardComponent,
    SuggestedJobPostCardComponent,
    MainJobRightBannerComponent
  ],
  templateUrl: './job-page.component.html',
})
export class JobPageComponent {

}

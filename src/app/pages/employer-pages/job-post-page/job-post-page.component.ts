import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobPostCardComponent } from '../../_components/employers/job-post-card/job-post-card.component';

@Component({
  selector: 'app-job-post-page',
  standalone: true,
  imports: [
    CommonModule,
    JobPostCardComponent
  ],
  templateUrl: './job-post-page.component.html',
})
export class JobPostPageComponent {}

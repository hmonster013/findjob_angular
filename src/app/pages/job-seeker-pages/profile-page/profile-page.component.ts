import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { BoxProfileComponent } from '../../_components/job-seekers/box-profile/box-profile.component';
import { ProfileUploadComponent } from '../../_components/job-seekers/profile-upload/profile-upload.component';
import { CompanyViewedCardComponent } from '../../_components/job-seekers/company-viewed-card/company-viewed-card.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BoxProfileComponent,
    ProfileUploadComponent,
    CompanyViewedCardComponent,
  ],
  templateUrl: './profile-page.component.html',
})
export class ProfilePageComponent {}

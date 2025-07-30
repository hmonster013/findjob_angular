import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { BoxProfileComponent } from '../../_components/job-seekers/box-profile/box-profile.component';
import { ProfileUploadComponent } from '../../_components/job-seekers/profile-upload/profile-upload.component';
import { CompanyViewedCardComponent } from '../../_components/job-seekers/company-viewed-card/company-viewed-card.component';
import { AuthStateService } from '../../../_services/auth-state.service';
import { CommonService } from '../../../_services/common.service';

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
export class ProfilePageComponent implements OnInit {
  currentUser: any;
  allConfigs: any;

  constructor(
    private authStateService: AuthStateService,
    private commonService: CommonService,
  ){ }

  ngOnInit(): void {
    this.currentUser = this.authStateService.getCurrentUser();
    this.getConfigs();
  }

  getConfigs() {
    this.commonService.getConfigs().subscribe({
      next: (res) => {
        this.allConfigs = res.data
      },
      error: (err) => {

      }
    })
  }
}

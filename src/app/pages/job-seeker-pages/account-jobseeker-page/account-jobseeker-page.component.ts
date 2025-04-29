import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountCardComponent } from '../../_components/auths/account-card/account-card.component';
import { PersonalInfoCardComponent } from '../../_components/job-seekers/personal-info-card/personal-info-card.component';
import { SettingCardComponent } from '../../_components/settings/setting-card/setting-card.component';

@Component({
  selector: 'app-account-jobseeker-page',
  standalone: true,
  imports: [
    CommonModule,
    AccountCardComponent,
    PersonalInfoCardComponent,
    SettingCardComponent,
  ],
  templateUrl: './account-jobseeker-page.component.html',
})
export class AccountJobSeekerPageComponent {}

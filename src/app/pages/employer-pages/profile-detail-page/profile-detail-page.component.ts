import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileDetailCardComponent } from '../../_components/employers/profile-detail-card/profile-detail-card.component';

@Component({
  selector: 'app-profile-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    ProfileDetailCardComponent
  ],
  templateUrl: './profile-detail-page.component.html',
})
export class ProfileDetailPageComponent {

}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileCardComponent } from '../../_components/employers/profile-card/profile-card.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    ProfileCardComponent
  ],
  templateUrl: './profile-page.component.html',
})
export class ProfilePageComponent {}

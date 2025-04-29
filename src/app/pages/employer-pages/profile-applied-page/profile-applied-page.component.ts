import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppliedResumeCardComponent } from '../../_components/employers/applied-resume-card/applied-resume-card.component';

@Component({
  selector: 'app-profile-applied-page',
  standalone: true,
  imports: [
    CommonModule,
    AppliedResumeCardComponent
  ],
  templateUrl: './profile-applied-page.component.html',
})
export class ProfileAppliedPageComponent {}

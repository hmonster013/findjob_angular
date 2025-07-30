import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SavedResumeCardComponent } from '../../_components/employers/saved-resume-card/saved-resume-card.component';

@Component({
  selector: 'app-saved-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    SavedResumeCardComponent
  ],
  templateUrl: './saved-profile-page.component.html',
})
export class SavedProfilePageComponent {}

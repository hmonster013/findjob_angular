import { IMAGES } from './../../_configs/constants';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-feedback-card',
  imports: [
    CommonModule
  ],
  templateUrl: './feedback-card.component.html',
  styleUrl: './feedback-card.component.css'
})
export class FeedbackCardComponent {
  @Input() avatarUrl: string = '';
  @Input() fullName: string = '';
  @Input() content: string = '';
  @Input() isLoading: boolean = false;

  IMAGES = IMAGES;
}

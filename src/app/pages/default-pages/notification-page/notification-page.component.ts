import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APP_NAME } from '../../../_configs/constants';
import { NotificationCardComponent } from '../../_components/defaults/notification-card/notification-card.component';

@Component({
  selector: 'app-notification-page',
  standalone: true,
  imports: [
    CommonModule,
    NotificationCardComponent
  ],
  templateUrl: './notification-page.component.html',
  styleUrl: './notification-page.component.css'
})
export class NotificationPageComponent {
  appName = APP_NAME;
}

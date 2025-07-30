import { IMAGES } from './../../../../_configs/constants';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStateService } from '../../../../_services/auth-state.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  @Input() userId!: string;
  @Input() text!: string;
  @Input() avatarUrl!: string;
  @Input() createdAt: any;

  currentUser: any;

  IMAGES = IMAGES;
  constructor(private authStateService: AuthStateService) {
    this.currentUser = this.authStateService.getCurrentUser();
  }

  isOwnMessage(): boolean {
    return this.currentUser?.id?.toString() === this.userId?.toString();
  }

  formatCreatedAt(): string {
    if (!this.createdAt) {
      return 'Đang gửi ...';
    }

    if (this.createdAt && typeof this.createdAt.seconds === 'number') {
      return this.formatMessageDate(this.createdAt.seconds * 1000);
    }

    try {
      const date = new Date(this.createdAt);
      if (!isNaN(date.getTime())) {
        return this.formatMessageDate(date.getTime());
      }
    } catch (e) {

    }

    return 'Đang gửi ...';
  }

  formatMessageDate(timestamp: number): string {
    const now = new Date();
    const date = new Date(timestamp);

    const isToday = now.toDateString() === date.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = yesterday.toDateString() === date.toDateString();

    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
    };

    if (isToday) {
      return `Hôm nay ${date.toLocaleTimeString('vi-VN', options)}`;
    } else if (isYesterday) {
      return `Hôm qua ${date.toLocaleTimeString('vi-VN', options)}`;
    } else {
      return `${date.toLocaleDateString('vi-VN')} ${date.toLocaleTimeString('vi-VN', options)}`;
    }
  }
}

import { IMAGES } from './../../../_configs/constants';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-info.component.html',
  styleUrl: './chat-info.component.css'
})
export class ChatInfoComponent {
  @Input() avatarUrl: string = '';
  @Input() title: string = '';
  @Input() subTitle: string = '';
  @Input() description: string = '';
  @Input() mode: 'center' | 'row' = 'center';

  IMAGES = IMAGES;
}

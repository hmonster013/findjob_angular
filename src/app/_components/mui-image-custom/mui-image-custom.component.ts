import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mui-image-custom',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mui-image-custom.component.html',
})
export class MuiImageCustomComponent {
  @Input() src = '';
  @Input() alt = 'image';
  @Input() className = '';
  @Input() fit: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down' = 'cover';
  @Input() transitionStyle = 'all 0.3s ease';
  @Input() width?: number;
  @Input() height?: number;

  handleError(event: Event) {
    (event.target as HTMLImageElement).src = '/assets/images/fallback.png';
  }
}

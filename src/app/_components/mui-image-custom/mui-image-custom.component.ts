import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mui-image-custom',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mui-image-custom.component.html',
  styleUrls: ['./mui-image-custom.component.css'],
})
export class MuiImageCustomComponent {
  @Input() src: string = '';
  @Input() alt: string = 'image';
  @Input() className: string = '';
  @Input() fit: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down' = 'cover';
  @Input() width?: number;
  @Input() height?: number;

  isLoading: boolean = true;
  isLoaded: boolean = false;
  private readonly fallbackImage: string = '/assets/images/fallback.png';
  private readonly validFitValues: string[] = ['cover', 'contain', 'fill', 'none', 'scale-down'];

  get computedSrc(): string {
    return this.src && typeof this.src === 'string' ? this.src : this.fallbackImage;
  }

  get computedFit(): string {
    return this.validFitValues.includes(this.fit) ? this.fit : 'cover';
  }

  get computedClassName(): string {
    return `w-full max-w-full h-auto rounded-md shadow-sm ${this.className}`.trim();
  }

  handleLoad() {
    this.isLoading = false;
    this.isLoaded = true;
  }

  handleError(event: Event) {
    this.isLoading = false;
    this.isLoaded = true;
    (event.target as HTMLImageElement).src = this.fallbackImage;
  }
}

import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';

@Component({
  selector: 'app-image-gallery-custom',
  imports: [
    CommonModule
  ],
  templateUrl: './image-gallery-custom.component.html',
  styleUrl: './image-gallery-custom.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ImageGalleryCustomComponent {
  @Input() images: { original: string }[] = [];
}

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-data-card',
  imports: [
    CommonModule
  ],
  templateUrl: './no-data-card.component.html',
  styleUrl: './no-data-card.component.css'
})
export class NoDataCardComponent {
  @Input() title: string = 'Không có dữ liệu';
  @Input() imgComponentSvg?: string; // có thể là url hoặc chuỗi HTML SVG

  isSvgUrl(value?: string): boolean {
    if (!value) return false;
    return value.startsWith('http') || value.startsWith('/');
  }
}

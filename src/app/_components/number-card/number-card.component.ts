import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-number-card',
  imports: [
    CommonModule
  ],
  templateUrl: './number-card.component.html',
  styleUrl: './number-card.component.css'
})
export class NumberCardComponent {
  @Input() color: string = '#000000'; // màu chữ + viền
  @Input() backgroundColor: string = '#FFFFFF'; // màu nền
  @Input() number: number = 0; // số lượng (default 0)
  @Input() description: string = 'Mô tả'; // mô tả (default)
}

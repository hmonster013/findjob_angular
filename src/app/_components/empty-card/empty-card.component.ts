import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-empty-card',
  imports: [],
  templateUrl: './empty-card.component.html',
  styleUrl: './empty-card.component.css'
})
export class EmptyCardComponent {
  @Input() content: string = 'Không có dữ liệu';
  @Input() labelButton: string = 'Thêm mới';
  @Output() onClick = new EventEmitter<void>();
}

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-chat-room-search',
  imports: [],
  templateUrl: './chat-room-search.component.html',
  styleUrl: './chat-room-search.component.css'
})
export class ChatRoomSearchComponent {
  @Input() value: string = '';
  @Input() placeholder: string = 'Tìm kiếm...';
  @Output() valueChange = new EventEmitter<string>();

  onInput(event: any) {
    this.valueChange.emit(event.target.value);
  }
}

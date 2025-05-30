import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
// Nếu có ChatService thì inject ở đây

@Component({
  selector: 'app-chat-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './chat-layout.component.html',
  styleUrls: ['./chat-layout.component.css'],
})
export class ChatLayoutComponent {
  constructor() {

  }
}

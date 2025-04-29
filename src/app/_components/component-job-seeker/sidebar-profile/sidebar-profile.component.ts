import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar-profile',
  imports: [
    CommonModule
  ],
  templateUrl: './sidebar-profile.component.html',
  styleUrl: './sidebar-profile.component.css'
})
export class SidebarProfileComponent {
  @Input() currentUser: any;

  defaultAvatar = '/assets/images/default-avatar.png'; // Đường dẫn ảnh default

  constructor() {}
}

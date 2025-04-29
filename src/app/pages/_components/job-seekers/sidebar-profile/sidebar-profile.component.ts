import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar-profile',
  standalone: true,
  templateUrl: './sidebar-profile.component.html',
  styleUrls: ['./sidebar-profile.component.css'],
  imports: [CommonModule],
})
export class SidebarProfileComponent {
  @Input() currentUser: any;
}

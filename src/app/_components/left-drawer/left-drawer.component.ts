import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-left-drawer',
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './left-drawer.component.html',
  styleUrl: './left-drawer.component.css'
})
export class LeftDrawerComponent {
  @Input() pages: { id: number; label: string; path: string }[] = [];
  @Input() mobileOpen = false;
  @Output() close = new EventEmitter<void>();

  handleDrawerToggle() {
    this.close.emit();
  }
}

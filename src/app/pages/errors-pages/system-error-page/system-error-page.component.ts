import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-system-error-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './system-error-page.component.html',
})
export class SystemErrorPageComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }
}

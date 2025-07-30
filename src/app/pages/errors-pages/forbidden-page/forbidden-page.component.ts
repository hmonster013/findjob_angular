import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ROUTES } from '../../../_configs/constants';

@Component({
  selector: 'app-forbidden-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forbidden-page.component.html',
})
export class ForbiddenPageComponent {

  ROUTES = ROUTES;

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }

  goLogin() {
    this.router.navigate(['/' + ROUTES.AUTH.LOGIN]);
  }
}

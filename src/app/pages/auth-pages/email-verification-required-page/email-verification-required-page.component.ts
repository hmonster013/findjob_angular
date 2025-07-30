import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { AuthStateService } from '../../../_services/auth-state.service';

@Component({
  selector: 'app-email-verification-required-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './email-verification-required-page.component.html',
  styleUrls: ['./email-verification-required-page.component.css'],
})
export class EmailVerificationRequiredPageComponent implements OnInit {
  email: string = '';

  constructor(
    private titleService: Title,
    private authStateService: AuthStateService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Xác thực email');
    const currentUser = this.authStateService.getCurrentUser();
    this.email = currentUser?.email || '';
  }
}

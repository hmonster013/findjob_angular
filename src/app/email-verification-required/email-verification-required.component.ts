import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-email-verification-required',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './email-verification-required.component.html',
  styleUrls: ['./email-verification-required.component.css']
})
export class EmailVerificationRequiredComponent implements OnInit {
  email: string | null = null;
  role: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || null;
      this.role = params['role'] || null;
    });
  }

  resendVerificationEmail(): void {
    if (!this.email || !this.role) {
      this.toastrService.error('Thiếu thông tin email hoặc vai trò.', 'Thông báo');
      return;
    }

    const data = {
      email: this.email,
      role: this.role
    };

    // this.authService.resendVerificationEmail(data).subscribe({
    //   next: () => {
    //     this.toastrService.success('Gửi lại email xác nhận thành công!', 'Thông báo');
    //   },
    //   error: () => {
    //     this.toastrService.error('Gửi lại email thất bại. Vui lòng thử lại.', 'Thông báo');
    //   }
    // });
  }
}

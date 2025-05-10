import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { EmployerSignUpFormComponent } from '../../_components/auths/employer-sign-up-form/employer-sign-up-form.component';
import { AuthenticationService } from '../../../_services/authentication.service';
import { AuthStateService } from '../../../_services/auth-state.service';
import { ROLES_NAME } from '../../../_configs/constants';

@Component({
  selector: 'app-employer-sign-up-page',
  standalone: true,
  imports: [CommonModule, EmployerSignUpFormComponent],
  templateUrl: './employer-sign-up-page.component.html',
  styleUrls: ['./employer-sign-up-page.component.css'],
})
export class EmployerSignUpPageComponent implements OnInit {
  isLoading = false;
  serverErrors: any = {};

  constructor(
    private authService: AuthenticationService,
    private authStateService: AuthStateService,
    private toastr: ToastrService,
    private router: Router,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Đăng ký tài khoản Nhà tuyển dụng');
  }

  onSubmit(formData: any) {
    this.isLoading = true;
    this.authService.employerRegister(formData).subscribe({
      next: (res) => {
        if (res.status) {
          this.authStateService.setCurrentUser({ email: formData.email });
          this.toastr.success('Đăng ký thành công. Vui lòng xác thực email.');
          this.router.navigate(['/email-verification']);
        } else {
          this.serverErrors = res.errors || { general: res.message || 'Đăng ký thất bại' };
          this.toastr.error(res.message || 'Đăng ký thất bại');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Lỗi đăng ký:', error);
        this.serverErrors = { general: 'Có lỗi xảy ra. Vui lòng thử lại sau.' };
        this.toastr.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
        this.isLoading = false;
      },
    });
  }

  checkCreds(email: string) {
    this.authService.checkCreds(email, ROLES_NAME.EMPLOYER).subscribe({
      next: (res) => {
        if (!res.status) {
          this.serverErrors = { email: res.message || 'Email đã tồn tại.' };
        } else {
          this.serverErrors = {};
        }
      },
      error: (error) => {
        console.error('Lỗi checkCreds:', error);
        this.serverErrors = { email: 'Không thể kiểm tra email. Vui lòng thử lại.' };
      },
    });
  }
}

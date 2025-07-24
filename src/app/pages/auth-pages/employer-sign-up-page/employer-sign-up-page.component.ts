import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { EmployerSignUpFormComponent } from '../../_components/auths/employer-sign-up-form/employer-sign-up-form.component';
import { AuthStateService } from '../../../_services/auth-state.service';
import { IMAGES, ROLES_NAME, ROUTES } from '../../../_configs/constants';
import { AuthenticationService } from '../../../_services/authentication.service';

@Component({
  selector: 'app-employer-sign-up-page',
  standalone: true,
  imports: [
    CommonModule,
    EmployerSignUpFormComponent
  ],
  templateUrl: './employer-sign-up-page.component.html',
  styleUrls: ['./employer-sign-up-page.component.css'],
})
export class EmployerSignUpPageComponent implements OnInit {
  isLoading = false;
  serverErrors: any = {};

  IMAGES = IMAGES;
  ROUTES = ROUTES;

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
    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      platform: formData.platform,
      company: {
        companyName: formData.companyName,
        companyEmail: formData.companyEmail,
        companyPhone: formData.companyPhone,
        taxCode: formData.taxCode,
        fieldOperation: formData.fieldOperation,
        since: formData.since,
        employeeSize: formData.employeeSize,
        websiteUrl: formData.websiteUrl,
        location: {
          city: formData.city,
          district: formData.district,
          address: formData.address
        }
      }
    };

    this.authService.employerRegister(payload).subscribe({
      next: (res) => {
        if (res.errors && Object.keys(res.errors).length == 0) {
          this.toastr.success('Đăng ký thành công. Vui lòng xác thực email.');
          this.router.navigate(['/' + ROUTES.AUTH.EMAIL_VERIFICATION]);
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
        if (res.data?.exists) {
          this.serverErrors = { email: 'Email này đã được sử dụng.' };
        } else {
          this.serverErrors = {};
        }
      },
      error: (error) => {
        console.error('Lỗi kiểm tra email:', error);
        this.serverErrors = { email: 'Không thể kiểm tra email. Vui lòng thử lại.' };
      },
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../../_services/authentication.service';
import { ResetPasswordFormComponent } from '../../_components/auths/reset-password-form/reset-password-form.component';
import { PLATFORM } from '../../../_configs/constants';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [
    CommonModule,
    ResetPasswordFormComponent
  ],
  templateUrl: './reset-password-page.component.html',
  styleUrls: ['./reset-password-page.component.css']
})
export class ResetPasswordPageComponent implements OnInit {
  isLoading = false;
  token: string = '';
  errorMessage: string | null = null;
  serverErrors: any = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  onResetPassword(data: any) {
    console.log("reset")
    this.isLoading = true;
    this.errorMessage = null;
    this.serverErrors = null;

    const payload = {
      ...data,
      token: this.token,
      platform: PLATFORM,
    };

    this.authService.resetPassword(payload).subscribe({
      next: (res) => {
        const redirectUrl = res.data?.redirectLoginUrl || '/dang-nhap';
        this.router.navigate([`${redirectUrl}`], {
          queryParams: {
            successMessage: 'Cập nhật mật khẩu thành công.',
          },
        });
        this.isLoading = false;
      },
      error: (err) => {
        const errors = err.error?.errors;
        if (errors?.errorMessage) {
          this.errorMessage = errors.errorMessage;
        } else {
          this.serverErrors = errors;
        }
        this.isLoading = false;
      }
    });
  }
}

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { TokenService } from '../_services/token.service';
import { Router } from '@angular/router';
import { AUTH_CONFIG } from '../_configs/constants';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private tokenService: TokenService,
    private toastrService: ToastrService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.createForm();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { email, password, role } = this.loginForm.value;

    this.authService.checkCreds(email, role).subscribe({
      next: (res) => {
        const { exists, email: resEmail, email_verified } = res.data;

        if (exists && !email_verified) {
          // chuyển hướng sang verify email
          this.router.navigate(['/email-verification-required'], {
            queryParams: { email, role },
          });
          return;
        }

        if (!exists) {
          this.toastrService.warning('Không tồn tại tài khoản ứng viên nào với email này!', 'Thông báo');
          return;
        }

        // Nếu OK -> tiếp tục lấy token
        this.authService.getToken(resEmail, password, role).subscribe({
          next: (tokenRes) => {
            const { access_token, refresh_token, backend } = tokenRes.data;

            this.tokenService.saveAccessTokenAndRefreshTokenToCookie(
              access_token,
              refresh_token,
              backend
            );

            // Gọi getUserInfo (nếu bạn có userService)
            this.authService.getUserInfo().subscribe(() => {
              this.router.navigate(['/']);
            });
          },
          error: (err) => {
            this.errorMessage = err.error?.errors?.errorMessage?.[0];
            this.toastrService.warning(this.errorMessage, 'Thông báo');
          }
        });
      },
      error: (err) => {
        this.errorMessage = err.error?.errors?.errorMessage?.[0];
        this.toastrService.error(this.errorMessage, 'Thông báo');
      }
    });
  }

  handleSocialLogin(provider: string, accessToken: string): void {
    const clientId = provider === 'facebook' ? AUTH_CONFIG.FACEBOOK_CLIENT_ID : AUTH_CONFIG.GOOGLE_CLIENT_ID;
    const clientSecret = provider === 'facebook' ? AUTH_CONFIG.FACEBOOK_CLIENT_SECRET : AUTH_CONFIG.GOOGLE_CLIENT_SECRET;

    this.authService.convertToken(clientId, clientSecret, provider, accessToken).subscribe({
      next: (res) => {
        const { access_token, refresh_token, backend } = res;

        this.tokenService.saveAccessTokenAndRefreshTokenToCookie(
          access_token,
          refresh_token,
          backend
        );

        this.authService.getUserInfo().subscribe(() => {
          this.router.navigate(['/']);
        });
      },
      error: () => {
        this.toastrService.error('Đăng nhập bằng tài khoản xã hội thất bại!', 'Thông báo');
      }
    });
  }

  private createForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['JOB_SEEKER']
    })
  }
}

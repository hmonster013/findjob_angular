import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../_services/authentication.service';
import { TokenService } from '../_services/token.service';
import { Router } from '@angular/router';
import { AUTH_CONFIG, AUTH_PROVIDER, PLATFORM, ROLES_NAME } from '../_configs/constants';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage: any;
  serverErrors: any = {};

  constructor(
    private authService: AuthenticationService,
    private tokenService: TokenService,
    private toastrService: ToastrService,
    private router: Router,
    private fb: FormBuilder,
  ) {

  }

  ngOnInit(): void {
    this.createForm();
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    const { fullName, email, password, confirmPassword } = this.registerForm.value;

    if (password !== confirmPassword) {
      this.toastrService.warning('Mật khẩu xác nhận không đúng.', 'Thông báo');
      return;
    }

    const data = {
      fullName,
      email,
      password,
      confirmPassword,
      platform: PLATFORM
    };

    this.authService.jobSeekerRegister(data).subscribe({
      next: () => {
        this.router.navigate(
          ['/email-verification-required'],
          {queryParams: { email, role: ROLES_NAME.JOB_SEEKER}}
        )
      },
      error: (err) => {
        this.errorMessage = err.error?.errors?.errorMessage?.[0];
        this.toastrService.warning(this.errorMessage, 'Thông báo');
      }
    })
  }

  handleFacebookRegister(accessToken: string): void {
    this.handleSocialRegister(AUTH_CONFIG.FACEBOOK_CLIENT_ID, AUTH_CONFIG.FACEBOOK_CLIENT_SECRET, AUTH_PROVIDER.FACEBOOK, accessToken);
  }

  handleGoogleRegister(accessToken: string): void {
    this.handleSocialRegister(AUTH_CONFIG.GOOGLE_CLIENT_ID, AUTH_CONFIG.GOOGLE_CLIENT_SECRET, AUTH_PROVIDER.GOOGLE, accessToken);
  }

  private handleSocialRegister(
    clientId: string,
    clientSecret: string,
    provider: string,
    token: string
  ): void {
    this.authService.convertToken(clientId, clientSecret, provider, token).subscribe({
      next: (res) => {
        const { access_token, refresh_token, backend } = res.data;

        this.tokenService.saveAccessTokenAndRefreshTokenToCookie(access_token, refresh_token, backend);

        this.authService.getUserInfo().subscribe(() => {
          this.router.navigate(['/']);
        });
      },
      error: (err) => {
        this.errorMessage = err.error?.errors?.errorMessage?.[0];
        this.toastrService.warning(this.errorMessage, 'Thông báo');
      }
    })
  }

  createForm() {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    })
  }
}

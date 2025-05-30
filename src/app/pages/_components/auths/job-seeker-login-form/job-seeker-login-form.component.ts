import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-seeker-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './job-seeker-login-form.component.html',
})
export class JobSeekerLoginFormComponent implements OnInit {
  form: FormGroup;
  isLoadingEmail = false;
  isLoadingFacebook = false;
  isLoadingGoogle = false;
  showPassword = false; // Thêm trạng thái showPassword

  @Output() submitForm = new EventEmitter<{ email: string; password: string }>();
  @Output() facebookLogin = new EventEmitter<string>();
  @Output() googleLogin = new EventEmitter<string>();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    window.addEventListener('message', this.handleSocialLoginMessage.bind(this));
  }

  handleSubmit() {
    if (this.form.valid && !this.isLoadingEmail) {
      this.isLoadingEmail = true;
      this.submitForm.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  handleFacebookLogin() {
    if (this.isLoadingFacebook) return;
    this.isLoadingFacebook = true;
    window.open('/auth/facebook', '_blank', 'width=500,height=600');
  }

  handleGoogleLogin() {
    if (this.isLoadingGoogle) return;
    this.isLoadingGoogle = true;
    window.open('/auth/google', '_blank', 'width=500,height=600');
  }

  private handleSocialLoginMessage(event: MessageEvent) {
    if (event.data.type === 'social_login') {
      const { provider, token } = event.data;
      if (provider === 'facebook') {
        this.facebookLogin.emit(token);
        this.isLoadingFacebook = false;
      } else if (provider === 'google') {
        this.googleLogin.emit(token);
        this.isLoadingGoogle = false;
      }
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword; // Thêm phương thức toggle
  }

  resetLoadingEmail() {
    this.isLoadingEmail = false;
  }
}

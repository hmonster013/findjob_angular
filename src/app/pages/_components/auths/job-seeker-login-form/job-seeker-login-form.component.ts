import {
  Component,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-seeker-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './job-seeker-login-form.component.html',
})
export class JobSeekerLoginFormComponent implements OnInit {
  form: FormGroup;

  @Output() submitForm = new EventEmitter<{ email: string; password: string }>();
  @Output() facebookLogin = new EventEmitter<string>(); // token
  @Output() googleLogin = new EventEmitter<string>();   // token

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  handleSubmit() {
    if (this.form.valid) {
      this.submitForm.emit(this.form.value);
    }
  }

  handleFacebookLogin() {
    const fbLoginWindow = window.open('/auth/facebook', '_blank', 'width=500,height=600');

    const interval = setInterval(() => {
      try {
        if (fbLoginWindow?.closed) {
          clearInterval(interval);
        }

        const token = localStorage.getItem('fb_access_token');
        if (token) {
          localStorage.removeItem('fb_access_token');
          this.facebookLogin.emit(token);
          fbLoginWindow?.close();
          clearInterval(interval);
        }
      } catch (_) {}
    }, 500);
  }

  handleGoogleLogin() {
    const ggLoginWindow = window.open('/auth/google', '_blank', 'width=500,height=600');

    const interval = setInterval(() => {
      try {
        if (ggLoginWindow?.closed) {
          clearInterval(interval);
        }

        const token = localStorage.getItem('google_access_token');
        if (token) {
          localStorage.removeItem('google_access_token');
          this.googleLogin.emit(token);
          ggLoginWindow?.close();
          clearInterval(interval);
        }
      } catch (_) {}
    }, 500);
  }
}

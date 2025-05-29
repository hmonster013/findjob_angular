import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PLATFORM } from '../../../../_configs/constants';

@Component({
  selector: 'app-job-seeker-sign-up-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './job-seeker-sign-up-form.component.html'
})
export class JobSeekerSignUpFormComponent implements OnInit {
  @Input() serverErrors: any = null;
  @Output() submitForm = new EventEmitter<any>();
  @Output() facebookRegister = new EventEmitter<string>(); // token
  @Output() googleRegister = new EventEmitter<string>(); // token

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        fullName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
        platform: PLATFORM
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {}

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  handleSubmit() {
    if (this.form.valid) {
      this.submitForm.emit(this.form.value);
    }
  }

  handleFacebookLogin() {
    const popup = window.open('/auth/facebook', '_blank', 'width=500,height=600');
    const interval = setInterval(() => {
      try {
        const token = localStorage.getItem('fb_access_token');
        if (token) {
          localStorage.removeItem('fb_access_token');
          this.facebookRegister.emit(token);
          popup?.close();
          clearInterval(interval);
        }
      } catch (_) {}
    }, 500);
  }

  handleGoogleLogin() {
    const popup = window.open('/auth/google', '_blank', 'width=500,height=600');
    const interval = setInterval(() => {
      try {
        const token = localStorage.getItem('google_access_token');
        if (token) {
          localStorage.removeItem('google_access_token');
          this.googleRegister.emit(token);
          popup?.close();
          clearInterval(interval);
        }
      } catch (_) {}
    }, 500);
  }
}

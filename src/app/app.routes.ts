import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HomeComponent } from './home/home.component';
import { EmailVerificationRequiredComponent } from './email-verification-required/email-verification-required.component';

export const routes: Routes = [
  // Test
  { path: 'test-components', component: LoginComponent },

  // 🔐 Auth routes
  { path: 'dang-nhap', component: LoginComponent },
  { path: 'dang-ky', component: RegisterComponent },
  { path: 'quen-mat-khau', component: ForgotPasswordComponent },
  { path: 'cap-nhat-mat-khau/:token', component: ResetPasswordComponent },
  { path: 'email-verification-required', component: EmailVerificationRequiredComponent },

  // 🧑‍💼 Job seeker
  { path: '', component: HomeComponent },
  { path: 'viec-lam', component: AppComponent },
  { path: 'viec-lam/:slug', component: AppComponent },
  { path: 'cong-ty', component: AppComponent },
  { path: 'cong-ty/:slug', component: AppComponent },
  { path: 've-chung-toi', component: AppComponent },
  { path: 'viec-lam-theo-nganh-nghe', component: AppComponent },
  { path: 'viec-lam-theo-tinh-thanh', component: AppComponent },
  { path: 'viec-lam-theo-hinh-thuc-lam-viec', component: AppComponent },
  { path: 'bang-dieu-khien', component: AppComponent },
  { path: 'ho-so', component: AppComponent },
  { path: 'ho-so-tung-buoc/:slug', component: AppComponent },
  { path: 'ho-so-dinh-kem/:slug', component: AppComponent },
  { path: 'viec-lam-cua-toi', component: AppComponent },
  { path: 'cong-ty-cua-toi', component: AppComponent },
  { path: 'thong-bao', component: AppComponent },
  { path: 'tai-khoan', component: AppComponent },
  { path: 'ket-noi-voi-nha-tuyen-dung', component: AppComponent },

  // 🧑‍💼 Employer
  { path: 'gioi-thieu', component: AppComponent },
  { path: 'dich-vu', component: AppComponent },
  { path: 'bao-gia', component: AppComponent },
  { path: 'ho-tro', component: AppComponent },
  { path: 'blog-tuyen-dung', component: AppComponent },
  { path: 'tin-tuyen-dung', component: AppComponent },
  { path: 'ho-so-ung-tuyen', component: AppComponent },
  { path: 'ho-so-da-luu', component: AppComponent },
  { path: 'danh-sach-ung-vien', component: AppComponent },
  { path: 'chi-tiet-ung-vien/:slug', component: AppComponent },
  { path: 'cai-dat', component: AppComponent },
  { path: 'ket-noi-voi-ung-vien', component: AppComponent },

  // ⚠️ Error fallback
  { path: 'forbidden', component: AppComponent },
  { path: '**', component: AppComponent }
];

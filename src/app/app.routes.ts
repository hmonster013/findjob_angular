import { Routes } from '@angular/router';
import { ForbiddenPageComponent } from './pages/errors-pages/forbidden-page/forbidden-page.component';
import { NotFoundPageComponent } from './pages/errors-pages/not-found-page/not-found-page.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { DefaultLayoutComponent } from './layouts/default-layout/default-layout.component';
import { JobSeekerLayoutComponent } from './layouts/job-seeker-layout/job-seeker-layout.component';
import { authGuard } from './_guard/auth.guard';
import { ChatLayoutComponent } from './layouts/chat-layout/chat-layout.component';
import { EmployerLayoutComponent } from './layouts/employer-layout/employer-layout.component';
import { SystemErrorPageComponent } from './pages/errors-pages/system-error-page/system-error-page.component';

export function generateRoutes(): Routes {
  const hostname = window.location.hostname;

  if (hostname === '127.0.0.1' || hostname === '1a2533d14838.ngrok-free.app') {
    // Job Seeker Routes
    return [
      {
        path: '',
        component: HomeLayoutComponent,
        children: [
          { path: '', loadComponent: () => import('./pages/default-pages/home-page/home-page.component').then(m => m.HomePageComponent) },
        ]
      },
      {
        path: '',
        component: DefaultLayoutComponent,
        children: [
          { path: 've-chung-toi', loadComponent: () => import('./pages/default-pages/about-us-page/about-us-page.component').then(m => m.AboutUsPageComponent) },
          { path: 'viec-lam', loadComponent: () => import('./pages/default-pages/job-page/job-page.component').then(m => m.JobPageComponent) },
          { path: 'viec-lam/:slug', loadComponent: () => import('./pages/default-pages/job-detail-page/job-detail-page.component').then(m => m.JobDetailPageComponent) },
          { path: 'cong-ty', loadComponent: () => import('./pages/default-pages/company-page/company-page.component').then(m => m.CompanyPageComponent) },
          { path: 'cong-ty/:slug', loadComponent: () => import('./pages/default-pages/company-detail-page/company-detail-page.component').then(m => m.CompanyDetailPageComponent) },
          { path: 'viec-lam-theo-nganh-nghe', loadComponent: () => import('./pages/default-pages/jobs-by-career-page/jobs-by-career-page.component').then(m => m.JobsByCareerPageComponent) },
          { path: 'viec-lam-theo-tinh-thanh', loadComponent: () => import('./pages/default-pages/jobs-by-city-page/jobs-by-city-page.component').then(m => m.JobsByCityPageComponent) },
          { path: 'viec-lam-theo-hinh-thuc-lam-viec', loadComponent: () => import('./pages/default-pages/jobs-by-job-type-page/jobs-by-job-type-page.component').then(m => m.JobsByJobTypePageComponent) },
        ]
      },
      {
        path: '',
        component: DefaultLayoutComponent,
        children: [
          { path: 'dang-nhap', loadComponent: () => import('./pages/auth-pages/job-seeker-login-page/job-seeker-login-page.component').then(m => m.JobSeekerLoginPageComponent) },
          { path: 'dang-ky', loadComponent: () => import('./pages/auth-pages/job-seeker-sign-up-page/job-seeker-sign-up-page.component').then(m => m.JobSeekerSignUpPageComponent) },
          { path: 'quen-mat-khau', loadComponent: () => import('./pages/auth-pages/forgot-password-page/forgot-password-page.component').then(m => m.ForgotPasswordPageComponent) },
          { path: 'cap-nhat-mat-khau/:token', loadComponent: () => import('./pages/auth-pages/reset-password-page/reset-password-page.component').then(m => m.ResetPasswordPageComponent) },
          { path: 'email-verification', loadComponent: () => import('./pages/auth-pages/email-verification-required-page/email-verification-required-page.component').then(m => m.EmailVerificationRequiredPageComponent) },
        ]
      },
      {
        path: 'bang-dieu-khien',
        component: JobSeekerLayoutComponent,
        canActivate: [authGuard],
        children: [
          { path: '', loadComponent: () => import('./pages/job-seeker-pages/dashboard-jobseeker-page/dashboard-jobseeker-page.component').then(m => m.DashboardJobSeekerPageComponent) },
          { path: 'ho-so', loadComponent: () => import('./pages/job-seeker-pages/profile-page/profile-page.component').then(m => m.ProfilePageComponent) },
          { path: 'ho-so-tung-buoc/:slug', loadComponent: () => import('./pages/job-seeker-pages/online-profile-page/online-profile-page.component').then(m => m.OnlineProfilePageComponent) },
          { path: 'ho-so-dinh-kem/:slug', loadComponent: () => import('./pages/job-seeker-pages/attached-profile-page/attached-profile-page.component').then(m => m.AttachedProfilePageComponent) },
          { path: 'viec-lam-cua-toi', loadComponent: () => import('./pages/job-seeker-pages/my-job-page/my-job-page.component').then(m => m.MyJobPageComponent) },
          { path: 'cong-ty-cua-toi', loadComponent: () => import('./pages/job-seeker-pages/my-company-page/my-company-page.component').then(m => m.MyCompanyPageComponent) },
          { path: 'thong-bao', loadComponent: () => import('./pages/default-pages/notification-page/notification-page.component').then(m => m.NotificationPageComponent) },
          { path: 'tai-khoan', loadComponent: () => import('./pages/job-seeker-pages/account-jobseeker-page/account-jobseeker-page.component').then(m => m.AccountJobSeekerPageComponent) },
        ]
      },
      {
        path: 'ket-noi-voi-nha-tuyen-dung',
        component: ChatLayoutComponent,
        canActivate: [authGuard],
        children: [
          { path: '', loadComponent: () => import('./pages/chat-pages/chat-page/chat-page.component').then(m => m.ChatPageComponent) },
        ]
      },
      { path: 'forbidden', component: ForbiddenPageComponent },
      { path: '**', component: NotFoundPageComponent },
      { path: 'system-error', component: SystemErrorPageComponent },
  ];
  } else if (hostname === 'localhost' || hostname === 'ba26-2a09-bac5-d45b-16d2-00-246-ef.ngrok-free.app') {
    // Employer Routes (localhost)
    return [
      {
        path: '',
        component: EmployerLayoutComponent,
        canActivate: [authGuard],
        children: [
          { path: '', loadComponent: () => import('./pages/employer-pages/dashboard-page/dashboard-page.component').then(m => m.DashboardPageComponent) },
          { path: 'tin-tuyen-dung', loadComponent: () => import('./pages/employer-pages/job-post-page/job-post-page.component').then(m => m.JobPostPageComponent) },
          { path: 'ho-so-ung-tuyen', loadComponent: () => import('./pages/employer-pages/profile-applied-page/profile-applied-page.component').then(m => m.ProfileAppliedPageComponent) },
          { path: 'ho-so-da-luu', loadComponent: () => import('./pages/employer-pages/saved-profile-page/saved-profile-page.component').then(m => m.SavedProfilePageComponent) },
          { path: 'danh-sach-ung-vien', loadComponent: () => import('./pages/employer-pages/profile-page/profile-page.component').then(m => m.ProfilePageComponent) },
          { path: 'chi-tiet-ung-vien/:slug', loadComponent: () => import('./pages/employer-pages/profile-detail-page/profile-detail-page.component').then(m => m.ProfileDetailPageComponent) },
          { path: 'cong-ty', loadComponent: () => import('./pages/employer-pages/company-page/company-page.component').then(m => m.CompanyPageComponent) },
          { path: 'thong-bao', loadComponent: () => import('./pages/default-pages/notification-page/notification-page.component').then(m => m.NotificationPageComponent) },
          { path: 'tai-khoan', loadComponent: () => import('./pages/employer-pages/account-page/account-page.component').then(m => m.AccountPageComponent) },
          { path: 'cai-dat', loadComponent: () => import('./pages/employer-pages/setting-page/setting-page.component').then(m => m.SettingPageComponent) },
        ]
      },
      {
        path: '',
        component: DefaultLayoutComponent,
        children: [
          { path: 'dang-nhap', loadComponent: () => import('./pages/auth-pages/employer-login-page/employer-login-page.component').then(m => m.EmployerLoginPageComponent) },
          { path: 'dang-ky', loadComponent: () => import('./pages/auth-pages/employer-sign-up-page/employer-sign-up-page.component').then(m => m.EmployerSignUpPageComponent) },
          { path: 'quen-mat-khau', loadComponent: () => import('./pages/auth-pages/forgot-password-page/forgot-password-page.component').then(m => m.ForgotPasswordPageComponent) },
          { path: 'cap-nhat-mat-khau/:token', loadComponent: () => import('./pages/auth-pages/reset-password-page/reset-password-page.component').then(m => m.ResetPasswordPageComponent) },
          { path: 'email-verification', loadComponent: () => import('./pages/auth-pages/email-verification-required-page/email-verification-required-page.component').then(m => m.EmailVerificationRequiredPageComponent) },
        ]
      },
      {
        path: 'ket-noi-voi-ung-vien',
        component: ChatLayoutComponent,
        canActivate: [authGuard],
        children: [
          { path: '', loadComponent: () => import('./pages/chat-pages/chat-page/chat-page.component').then(m => m.ChatPageComponent) },
        ]
      },
      { path: 'forbidden', component: ForbiddenPageComponent },
      { path: '**', component: NotFoundPageComponent },
      { path: 'system-error', component: SystemErrorPageComponent },
    ];
  } else {
    return [
      { path: '**', redirectTo: 'forbidden' }
    ];
  }
}

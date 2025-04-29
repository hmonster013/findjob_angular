import { Routes } from '@angular/router';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { DefaultLayoutComponent } from './layouts/default-layout/default-layout.component';
import { authGuard } from './_guard/auth.guard';
import { JobSeekerLayoutComponent } from './layouts/job-seeker-layout/job-seeker-layout.component';
import { EmployerLayoutComponent } from './layouts/employer-layout/employer-layout.component';
import { ChatLayoutComponent } from './layouts/chat-layout/chat-layout.component';


export const routes: Routes = [
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      // {
      //   path: '',
      //   loadComponent: () => import('./pages/default/home-page.component').then(m => m.HomePageComponent)
      // },
      // {
      //   path: 'about-us',
      //   loadComponent: () => import('./pages/default/about-us-page.component').then(m => m.AboutUsPageComponent)
      // },
      // {
      //   path: 'company/:companySlug',
      //   loadComponent: () => import('./pages/default/company-page.component').then(m => m.CompanyPageComponent)
      // },
      // {
      //   path: 'job-detail/:slug',
      //   loadComponent: () => import('./pages/default/job-detail-page.component').then(m => m.JobDetailPageComponent)
      // },
      // {
      //   path: 'profile/:userId',
      //   loadComponent: () => import('./pages/default/profile-page.component').then(m => m.ProfilePageComponent)
      // },
      // {
      //   path: 'search',
      //   loadComponent: () => import('./pages/default/search-page.component').then(m => m.SearchPageComponent)
      // }
    ]
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      // {
      //   path: 'login',
      //   loadComponent: () => import('./pages/auth/login-page.component').then(m => m.LoginPageComponent)
      // },
      // {
      //   path: 'register',
      //   loadComponent: () => import('./pages/auth/register-page.component').then(m => m.RegisterPageComponent)
      // },
      // {
      //   path: 'forget-password',
      //   loadComponent: () => import('./pages/auth/forget-password-page.component').then(m => m.ForgetPasswordPageComponent)
      // },
      // {
      //   path: 'employer/login',
      //   loadComponent: () => import('./pages/auth/employer-login-page.component').then(m => m.EmployerLoginPageComponent)
      // },
      // {
      //   path: 'employer/register',
      //   loadComponent: () => import('./pages/auth/employer-register-page.component').then(m => m.EmployerRegisterPageComponent)
      // },
      // {
      //   path: 'employer/forget-password',
      //   loadComponent: () => import('./pages/auth/employer-forget-password-page.component').then(m => m.EmployerForgetPasswordPageComponent)
      // }
    ]
  },
  {
    path: 'jobseeker',
    component: JobSeekerLayoutComponent,
    canActivate: [authGuard],
    children: [
      // {
      //   path: 'dashboard',
      //   loadComponent: () => import('./pages/jobseeker/dashboard-page.component').then(m => m.DashboardPageComponent)
      // },
      // {
      //   path: 'profile',
      //   loadComponent: () => import('./pages/jobseeker/my-profile-page.component').then(m => m.MyProfilePageComponent)
      // },
      // {
      //   path: 'saved-jobs',
      //   loadComponent: () => import('./pages/jobseeker/saved-jobs-page.component').then(m => m.SavedJobsPageComponent)
      // },
      // {
      //   path: 'applied-jobs',
      //   loadComponent: () => import('./pages/jobseeker/applied-jobs-page.component').then(m => m.AppliedJobsPageComponent)
      // }
    ]
  },
  {
    path: 'employer',
    component: EmployerLayoutComponent,
    canActivate: [authGuard],
    children: [
      // {
      //   path: 'dashboard',
      //   loadComponent: () => import('./pages/employer/dashboard-page.component').then(m => m.EmployerDashboardPageComponent)
      // },
      // {
      //   path: 'job-posts',
      //   loadComponent: () => import('./pages/employer/job-posts-page.component').then(m => m.JobPostsPageComponent)
      // },
      // {
      //   path: 'applied-profiles',
      //   loadComponent: () => import('./pages/employer/applied-profiles-page.component').then(m => m.AppliedProfilesPageComponent)
      // },
      // {
      //   path: 'saved-profiles',
      //   loadComponent: () => import('./pages/employer/saved-profiles-page.component').then(m => m.SavedProfilesPageComponent)
      // },
      // {
      //   path: 'company',
      //   loadComponent: () => import('./pages/employer/company-info-page.component').then(m => m.CompanyInfoPageComponent)
      // },
      // {
      //   path: 'account',
      //   loadComponent: () => import('./pages/employer/account-page.component').then(m => m.AccountPageComponent)
      // },
      // {
      //   path: 'settings',
      //   loadComponent: () => import('./pages/employer/setting-page.component').then(m => m.SettingPageComponent)
      // }
    ]
  },
  {
    path: 'chat',
    component: ChatLayoutComponent,
    canActivate: [authGuard],
    children: [
      // {
      //   path: '',
      //   loadComponent: () => import('./pages/chat/chat-list-page.component').then(m => m.ChatListPageComponent)
      // },
      // {
      //   path: ':conversationId',
      //   loadComponent: () => import('./pages/chat/chat-detail-page.component').then(m => m.ChatDetailPageComponent)
      // }
    ]
  },
  // {
  //   path: '**',
  //   loadComponent: () => import('./pages/error/not-found-page.component').then(m => m.NotFoundPageComponent)
  // }
];

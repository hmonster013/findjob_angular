import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../_components/commons/header/header.component';
import { FooterComponent } from '../_components/commons/footer/footer.component';
import { TabBarComponent } from '../_components/job-seekers/tab-bar/tab-bar.component';

@Component({
  selector: 'app-job-seeker-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    TabBarComponent,
    FooterComponent
  ],
  templateUrl: './job-seeker-layout.component.html',
  styleUrls: ['./job-seeker-layout.component.css'],
})
export class JobSeekerLayoutComponent {}

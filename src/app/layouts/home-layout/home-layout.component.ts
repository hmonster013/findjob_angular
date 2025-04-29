import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../_components/commons/header/header.component';
import { SubHeaderComponent } from '../_components/commons/sub-header/sub-header.component';
import { TopSlideComponent } from '../_components/commons/top-slide/top-slide.component';
import { FooterComponent } from '../_components/commons/footer/footer.component';

@Component({
  selector: 'app-home-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SubHeaderComponent,
    TopSlideComponent,
    FooterComponent
  ],
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.css'],
})
export class HomeLayoutComponent {}

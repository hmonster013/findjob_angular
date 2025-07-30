import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../_components/commons/header/header.component';
import { SearchContainerComponent } from '../../pages/_components/defaults/search-container/search-container.component';
import { TopSlideComponent } from '../_components/commons/top-slide/top-slide.component';
import { FooterComponent } from '../_components/commons/footer/footer.component';
import { HomeSearchComponent } from "../../pages/_components/defaults/home-search/home-search.component";

@Component({
  selector: 'app-home-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    TopSlideComponent,
    SearchContainerComponent
],
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.css'],
})
export class HomeLayoutComponent {

}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CareerCarouselComponent } from "../_components/company-highlight/company-highlight";
import { JobListComponent } from "../_components/job-list/job-list.component";

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
}

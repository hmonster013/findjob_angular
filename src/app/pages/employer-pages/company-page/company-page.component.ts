import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyCardComponent } from '../../_components/employers/company-card/company-card.component';
import { CompanyImageCardComponent } from '../../_components/employers/company-image-card/company-image-card.component';

@Component({
  selector: 'app-company-page',
  standalone: true,
  imports: [
    CommonModule,
    CompanyCardComponent,
    CompanyImageCardComponent
  ],
  templateUrl: './company-page.component.html',
})
export class CompanyPageComponent {
  selectedTab: 'company' | 'media' = 'company';

  selectTab(tab: 'company' | 'media') {
    this.selectedTab = tab;
  }
}

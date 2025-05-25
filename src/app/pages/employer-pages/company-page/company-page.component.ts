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
  styleUrls: ['./company-page.component.css']
})
export class CompanyPageComponent {
  selectedTab: 'company' | 'media' = 'company';
  tabItems: { id: 'company' | 'media'; label: string; icon: string }[] = [
    { id: 'company', label: 'Thông tin công ty', icon: 'building' },
    { id: 'media', label: 'Đa phương tiện', icon: 'images' }
  ];


  selectTab(tab: 'company' | 'media') {
    this.selectedTab = tab;
  }
}

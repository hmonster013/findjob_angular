import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanySearchComponent } from '../../_components/defaults/company-search/company-search.component';
import { CompaniesComponent } from '../../../_components/companies/companies.component';

@Component({
  selector: 'app-company-page',
  standalone: true,
  imports: [
    CommonModule,
    CompanySearchComponent,
    CompaniesComponent
  ],
  templateUrl: './company-page.component.html'
})
export class CompanyPageComponent {}

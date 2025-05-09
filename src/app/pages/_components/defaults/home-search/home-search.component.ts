import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../../../_services/common.service';

@Component({
  selector: 'app-home-search',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './home-search.component.html',
  styleUrl: './home-search.component.css'
})
export class HomeSearchComponent {
  careers: any[] = [];
  cities: any[] = [];
  keyword: string = '';
  selectedCareer: string = '';
  selectedCity: string = '';

  constructor(
    private commonService: CommonService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCareers();
    this.loadCities();
  }

  loadCareers() {
    this.commonService.getCareers(true).subscribe({
      next: (res) => {
        this.careers = res.data || [];
      },
      error: (err) => {
        console.error('Lỗi lấy danh sách ngành nghề:', err);
      }
    });
  }

  loadCities() {
    this.commonService.getCities().subscribe({
      next: (res) => {
        this.cities = res.data || [];
      },
      error: (err) => {
        console.error('Lỗi lấy danh sách thành phố:', err);
      }
    });
  }

  onSearch() {
    const queryParams: any = {};
    if (this.keyword) {
      queryParams.keyword = this.keyword;
    }
    if (this.selectedCareer) {
      queryParams.careerId = this.selectedCareer;
    }
    if (this.selectedCity) {
      queryParams.cityId = this.selectedCity;
    }

    // Chuyển hướng đến trang /viec-lam với query params
    this.router.navigate(['/viec-lam'], { queryParams });
  }
}

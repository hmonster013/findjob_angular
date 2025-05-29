import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../../../_services/common.service';
import { ROUTES } from '../../../../_configs/constants';

@Component({
  selector: 'app-home-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './home-search.component.html',
  styleUrls: ['./home-search.component.css']
})
export class HomeSearchComponent implements OnInit {
  form: FormGroup;
  careers: any[] = [];
  cities: any[] = [];
  ROUTES = ROUTES;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private router: Router
  ) {
    this.form = this.fb.group({
      kw: [''],
      careerId: [''],
      cityId: ['']
    });
  }

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
    const data = this.form.value;
    this.router.navigate([ROUTES.JOB_SEEKER.JOBS], { queryParams: data });
  }
}

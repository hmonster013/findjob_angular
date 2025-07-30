import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryCardComponent } from '../../_components/defaults/category-card/category-card.component';
import { CommonService } from '../../../_services/common.service';

@Component({
  selector: 'app-jobs-by-city-page',
  standalone: true,
  imports: [
    CommonModule,
    CategoryCardComponent
  ],
  templateUrl: './jobs-by-city-page.component.html',
})
export class JobsByCityPageComponent implements OnInit {
  cityOptions: any[] = [];
  isLoading = true;

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.commonService.getCities().subscribe({
      next: (res) => {
        this.cityOptions = res.data || [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}

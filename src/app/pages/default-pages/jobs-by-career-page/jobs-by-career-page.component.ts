import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../../_services/common.service';
import { CategoryCardComponent } from '../../_components/defaults/category-card/category-card.component';

@Component({
  selector: 'app-jobs-by-career-page',
  standalone: true,
  imports: [
    CommonModule,
    CategoryCardComponent
  ],
  templateUrl: './jobs-by-career-page.component.html',
})
export class JobsByCareerPageComponent implements OnInit {
  allCareerOptions: any[] = [];
  isLoading = true;

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.commonService.getCareers(true).subscribe({
      next: (res) => {
        this.allCareerOptions = res.data || [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}

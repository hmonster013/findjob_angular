import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryCardComponent } from '../../_components/defaults/category-card/category-card.component';
import { CommonService } from '../../../_services/common.service';

@Component({
  selector: 'app-jobs-by-job-type-page',
  standalone: true,
  imports: [CommonModule, CategoryCardComponent],
  templateUrl: './jobs-by-job-type-page.component.html',
})
export class JobsByJobTypePageComponent implements OnInit {
  jobTypeOptions: any[] = [];
  isLoading = true;

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.commonService.getConfigs().subscribe({
      next: (res) => {
        this.jobTypeOptions = res.data?.jobTypeOptions || [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}

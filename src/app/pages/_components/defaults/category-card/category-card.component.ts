import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ROUTES } from '../../../../_configs/constants';

@Component({
  selector: 'app-category-card',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.css'
})
export class CategoryCardComponent {
  @Input() options: any[] = [];
  @Input() type: 'CAREER' | 'CITY' | 'JOB_TYPE' = 'CAREER';

  items: any[] = [];
  searchValue: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.items = this.options || [];
  }

  handleFilterChange(value: string) {
    this.searchValue = value;
    const lowerValue = value.toLowerCase();
    this.items = this.options.filter(option =>
      option.name.toLowerCase().includes(lowerValue)
    );
  }

  handleFilter(id: number) {
    const queryParams: any = {};
    switch (this.type) {
      case 'CAREER':
        queryParams['careerId'] = id;
        break;
      case 'CITY':
        queryParams['cityId'] = id;
        break;
      case 'JOB_TYPE':
        queryParams['jobTypeId'] = id;
        break;
    }
    this.router.navigate([`/${ROUTES.JOB_SEEKER.JOBS}`], { queryParams });
  }
}

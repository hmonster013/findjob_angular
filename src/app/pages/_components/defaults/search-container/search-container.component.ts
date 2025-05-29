import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CommonService } from '../../../../_services/common.service';
import { Router, RouterLink } from '@angular/router';
import { SearchDialogComponent } from "../search-dialog/search-dialog.component";
import { ROUTES } from '../../../../_configs/constants';
import { HomeSearchComponent } from "../home-search/home-search.component";

@Component({
  selector: 'app-search-container',
  imports: [
    CommonModule,
    SearchDialogComponent,
    HomeSearchComponent
],
  templateUrl: './search-container.component.html',
  styleUrl: './search-container.component.css'
})
export class SearchContainerComponent {
  topCareers: any[] = [];
  open: boolean = false;

  constructor(
    private commonService: CommonService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getTopCareers();
  }

  getTopCareers() {
    this.commonService.getTop10Careers().subscribe({
      next: (res) => {
        this.topCareers = res.data;
      },
      error: (error) => {
        console.error('Lỗi tải top careers:', error);
      }
    });
  }

  handleFilter(careerId: number) {
    this.router.navigate([`/${ROUTES.JOB_SEEKER.JOBS}`], { queryParams: { careerId } });
  }

  toggleDialog(openStatus: boolean) {
    this.open = openStatus;

    if (openStatus) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}

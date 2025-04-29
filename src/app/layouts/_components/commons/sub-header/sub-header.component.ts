import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CommonService } from '../../../../_services/common.service';
import { Router, RouterLink } from '@angular/router';
import { SubHeaderDialogComponent } from "../sub-header-dialog/sub-header-dialog.component";
import { ROUTES } from '../../../../_configs/constants';

@Component({
  selector: 'app-sub-header',
  imports: [
    CommonModule,
    SubHeaderDialogComponent
],
  templateUrl: './sub-header.component.html',
  styleUrl: './sub-header.component.css'
})
export class SubHeaderComponent {
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
        this.topCareers = res.data || [];
      },
      error: (error) => {
        console.error('Lỗi tải top careers:', error);
      }
    });
  }

  handleFilter(careerId: number) {
    // Navigate to jobs page with selected careerId
    this.router.navigate([`/${ROUTES.JOB_SEEKER.JOBS}`], { queryParams: { careerId } });
  }

  toggleDialog(openStatus: boolean) {
    this.open = openStatus;
  }
}

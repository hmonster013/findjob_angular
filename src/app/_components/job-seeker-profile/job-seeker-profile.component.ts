import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '../../_configs/constants';
import { formatRoute } from '../../_utils/func-utils';
import { salaryString } from '../../_utils/custom-data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-seeker-profile',
  imports: [
    CommonModule
  ],
  templateUrl: './job-seeker-profile.component.html',
  styleUrl: './job-seeker-profile.component.css'
})
export class JobSeekerProfileComponent {
  @Input() id!: number;
  @Input() slug!: string;
  @Input() title!: string;
  @Input() salaryMin?: number;
  @Input() salaryMax?: number;
  @Input() experience!: string;
  @Input() updateAt!: string;
  @Input() isSaved: boolean = false;
  @Input() viewEmployerNumber!: number;
  @Input() city!: string;
  @Input() user?: { fullName?: string };
  @Input() jobSeekerProfile?: { old?: number };
  @Input() type!: string;
  @Input() lastViewedDate?: string;
  @Input() cityName?: string;
  @Input() experienceName?: string;
  @Input() isLoading: boolean = false;

  @Output() saveToggled = new EventEmitter<string>();

  constructor(private router: Router) {}

  viewProfile() {
    if (this.slug) {
      this.router.navigate([`/${formatRoute(ROUTES.EMPLOYER.PROFILE_DETAIL, this.slug)}`]);
    }
  }

  toggleSave() {
    this.saveToggled.emit(this.slug);
  }

  salaryStringFn(min?: number, max?: number): string {
    return salaryString(min, max);
  }
}

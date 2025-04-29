import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-action',
  imports: [
    CommonModule
  ],
  templateUrl: './company-action.component.html',
  styleUrl: './company-action.component.css'
})
export class CompanyActionComponent {
  @Input() company: any;
  @Input() resume: any;
  @Input() views?: number;
  @Input() createAt?: string;
  @Input() followNumber?: number;
  @Input() jobPostNumber?: number;
  @Input() fieldOperation?: string;
  @Input() isLoading: boolean = false; // ✅ thêm cờ loading

  defaultAvatar = 'assets/images/default-company.png';
  stackDirection: 'row' | 'column' = 'column';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.handleResize();
  }

  @HostListener('window:resize')
  handleResize() {
    const width = window.innerWidth;
    this.stackDirection = width < 800 ? 'column' : 'row';
  }

  navigateToCompany() {
    if (this.company?.slug) {
      this.router.navigate(['/company', this.company.slug]);
    }
  }

  get hasActionSlot() {
    return true;
  }
}

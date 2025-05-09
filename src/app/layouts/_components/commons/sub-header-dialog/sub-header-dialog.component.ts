import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonService } from '../../../../_services/common.service';

@Component({
  selector: 'app-sub-header-dialog',
  imports: [
    CommonModule
  ],
  templateUrl: './sub-header-dialog.component.html',
  styleUrl: './sub-header-dialog.component.css'
})
export class SubHeaderDialogComponent {
  @Input() open: boolean = false;
  @Input() topCareers: any[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() selectCareer = new EventEmitter<number>();

  isMobile: boolean = false;
  careers: any[] = [];
  hotCareers: any[] = [];
  otherCareers: any[] = [];
  allCareers: any[] = [];

  constructor (
    private commonService: CommonService,
  ) {

  }

  ngOnInit() {
    this.handleResize();
    this.getAllCareers();
  }

  getAllCareers() {
    this.commonService.getCareers().subscribe({
      next: (res) => {
        this.allCareers = res.results;
        this.combineCareers();
      },
      error: (err) => {

      }
    })
  }

  combineCareers() {
    const topCareerIds = this.topCareers.map(c => c.id);
    this.careers = (this.allCareers || []).map(career => ({
      ...career,
      isHot: topCareerIds.includes(career.id),
    }));

    this.hotCareers = this.careers.filter(c => c.isHot);
    this.otherCareers = this.careers.filter(c => !c.isHot);
  }

  @HostListener('window:resize')
  handleResize() {
    this.isMobile = window.innerWidth < 768;
  }

  onSelectCareer(careerId: number) {
    this.selectCareer.emit(careerId);
    this.close.emit();
  }
}

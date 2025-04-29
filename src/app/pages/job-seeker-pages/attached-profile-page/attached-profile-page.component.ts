import {
  Component,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalInfoCardComponent } from '../../_components/job-seekers/personal-info-card/personal-info-card.component';
import { GeneralInfoCardComponent } from '../../_components/job-seekers/general-info-card/general-info-card.component';
import { CvCardComponent } from '../../_components/job-seekers/cv-card/cv-card.component';

@Component({
  selector: 'app-attached-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    PersonalInfoCardComponent,
    GeneralInfoCardComponent,
    CvCardComponent,
  ],
  templateUrl: './attached-profile-page.component.html',
})
export class AttachedProfilePageComponent implements AfterViewInit {
  @ViewChildren('sectionRef') sectionRefs!: QueryList<ElementRef>;

  sections = [
    { id: 0, label: 'Thông tin cá nhân', icon: '🙍' },
    { id: 1, label: 'Thông tin chung', icon: '🧾' },
    { id: 2, label: 'Tải CV đính kèm', icon: '📎' },
  ];

  scrollToSection(index: number) {
    const section = this.sectionRefs.toArray()[index];
    section.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  ngAfterViewInit(): void {}
}

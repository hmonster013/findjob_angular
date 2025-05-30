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
import { ExperienceDetailCardComponent } from '../../_components/job-seekers/experience-detail-card/experience-detail-card.component';
import { EducationDetailCardComponent } from '../../_components/job-seekers/education-detail-card/education-detail-card.component';
import { CertificateCardComponent } from '../../_components/job-seekers/certificate-card/certificate-card.component';
import { LanguageSkillCardComponent } from '../../_components/job-seekers/language-skill-card/language-skill-card.component';
import { AdvancedSkillCardComponent } from '../../_components/job-seekers/advanced-skill-card/advanced-skill-card.component';

@Component({
  selector: 'app-online-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    PersonalInfoCardComponent,
    GeneralInfoCardComponent,
    ExperienceDetailCardComponent,
    EducationDetailCardComponent,
    CertificateCardComponent,
    LanguageSkillCardComponent,
    AdvancedSkillCardComponent,
  ],
  templateUrl: './online-profile-page.component.html',
})
export class OnlineProfilePageComponent implements AfterViewInit {
  @ViewChildren('sectionRef') sectionRefs!: QueryList<ElementRef>;

  sections = [
    'Thông tin cá nhân',
    'Thông tin chung',
    'Kinh nghiệm làm việc',
    'Thông tin học vấn',
    'Chứng chỉ',
    'Kỹ năng ngôn ngữ',
    'Kỹ năng chuyên môn',
  ];

  scrollTo(index: number) {
    const el = this.sectionRefs.toArray()[index];
    el?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  ngAfterViewInit(): void {}
}

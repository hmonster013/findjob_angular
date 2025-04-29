import { Component, Input } from '@angular/core';
import { ROUTES } from '../../_configs/constants';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-upload-card',
  imports: [
    CommonModule
  ],
  templateUrl: './profile-upload-card.component.html',
  styleUrl: './profile-upload-card.component.css'
})
export class ProfileUploadCardComponent {
  @Input() resumeImage: string = '';
  @Input() fileUrl: string = '';
  @Input() title: string = '';
  @Input() updateAt: string = '';
  @Input() slug: string = '';
  @Input() id?: number;
  @Input() isActive: boolean = false;

  @Input() handleDelete!: (slug: string) => void;
  @Input() handleActive!: (slug: string) => void;

  constructor(private router: Router) {}

  editProfile() {
    if (this.slug) {
      this.router.navigate([`/${ROUTES.JOB_SEEKER.DASHBOARD}/${this.slug}`]);
    }
  }

  downloadFile() {
    if (this.fileUrl && this.title) {
      // downloadPdf(this.fileUrl, this.title);
    }
  }
}

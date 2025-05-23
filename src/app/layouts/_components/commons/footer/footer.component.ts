import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { APP_NAME, ICONS, IMAGES, LINKS } from '../../../../_configs/constants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [
    CommonModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  LINKS = LINKS;
  ICONS = ICONS;
  IMAGES = IMAGES;
  APP_NAME = APP_NAME;

  constructor(private router: Router) {}

  navigate(path: string) {
    this.router.navigate([path]);
  }

  currentYear = new Date().getFullYear();

  socialLinks = [
    { icon: ICONS.FACEBOOK, link: LINKS.FACEBOOK_LINK },
    { icon: ICONS.FACEBOOK_MESSENGER, link: LINKS.FACEBOOK_MESSENGER_LINK },
    { icon: ICONS.INSTAGRAM, link: LINKS.INSTAGRAM_LINK },
    { icon: ICONS.LINKEDIN, link: LINKS.LINKEDIN_LINK },
    { icon: ICONS.YOUTUBE, link: LINKS.YOUTUBE_LINK },
    { icon: ICONS.TWITTER, link: LINKS.TWITTER_LINK },
  ];
}

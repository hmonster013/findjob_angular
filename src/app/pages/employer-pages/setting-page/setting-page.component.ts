import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingCardComponent } from '../../_components/settings/setting-card/setting-card.component';

@Component({
  selector: 'app-setting-page',
  standalone: true,
  imports: [
    CommonModule,
    SettingCardComponent
  ],
  templateUrl: './setting-page.component.html',
})
export class SettingPageComponent {}

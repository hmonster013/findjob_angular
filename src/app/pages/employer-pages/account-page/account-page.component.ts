import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountCardComponent } from '../../_components/auths/account-card/account-card.component';

@Component({
  selector: 'app-account-page',
  standalone: true,
  imports: [
    CommonModule,
    AccountCardComponent
  ],
  templateUrl: './account-page.component.html',
})
export class AccountPageComponent {}

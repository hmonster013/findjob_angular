import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { HOST_NAME, ROUTES } from '../../../../_configs/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-switch-menu',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './account-switch-menu.component.html',
  styleUrls: ['./account-switch-menu.component.css']
})
export class AccountSwitchMenuComponent {
  @Input() isShowButton = false;
  hostname = window.location.hostname;
  HOST_NAME = HOST_NAME;
  ROUTES = ROUTES;

  constructor(private router: Router) {}

  handleClick() {
    const target =
      this.hostname === HOST_NAME.MYJOB
        ? HOST_NAME.EMPLOYER_MYJOB
        : HOST_NAME.MYJOB;
    window.location.href = `http://${target}:4200/`;
  }

  handleClickAuth(isLogin: boolean = false) {
    const path = isLogin ? ROUTES.AUTH.LOGIN : ROUTES.AUTH.REGISTER;
    const target =
      this.hostname === HOST_NAME.MYJOB
        ? HOST_NAME.EMPLOYER_MYJOB
        : HOST_NAME.MYJOB;
    window.location.href = `http://${target}:4200/${path}`;
  }
}

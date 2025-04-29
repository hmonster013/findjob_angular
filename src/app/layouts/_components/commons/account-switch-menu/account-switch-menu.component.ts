import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { HOST_NAME, ROUTES } from '../../../../_configs/constants';
import { buildURL } from '../../../../_utils/func-utils';

@Component({
  selector: 'app-account-switch-menu',
  imports: [
    CommonModule
  ],
  templateUrl: './account-switch-menu.component.html',
  styleUrl: './account-switch-menu.component.css'
})
export class AccountSwitchMenuComponent {
  @Input() isShowButton: boolean = false;

  hostname = window.location.hostname;
  HOST_NAME = HOST_NAME;  // 🔥 thêm dòng này để template dùng được
  ROUTES = ROUTES;        // 🔥 nếu cần ROUTES trong template

  handleClick() {
    switch (this.hostname) {
      case HOST_NAME.MYJOB:
        window.open(buildURL(HOST_NAME.EMPLOYER_MYJOB), '_blank');
        break;
      case HOST_NAME.EMPLOYER_MYJOB:
        window.open(buildURL(HOST_NAME.MYJOB), '_blank');
        break;
      default:
        window.open(buildURL(HOST_NAME.MYJOB), '_blank');
    }
  }

  handleClickAuth(isLogin: boolean) {
    const path = isLogin ? ROUTES.AUTH.LOGIN : ROUTES.AUTH.REGISTER;

    switch (this.hostname) {
      case HOST_NAME.MYJOB:
        window.open(`${buildURL(HOST_NAME.EMPLOYER_MYJOB)}/${path}`, '_blank');
        break;
      case HOST_NAME.EMPLOYER_MYJOB:
        window.open(`${buildURL(HOST_NAME.MYJOB)}/${path}`, '_blank');
        break;
      default:
        window.open(`${buildURL(HOST_NAME.MYJOB)}/${path}`, '_blank');
    }
  }
}

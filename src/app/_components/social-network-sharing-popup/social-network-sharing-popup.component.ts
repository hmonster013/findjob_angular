import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-social-network-sharing-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './social-network-sharing-popup.component.html',
})
export class SocialNetworkSharingPopupComponent {
  @Input() open = false;

  @Input() facebookShareUrl = '';
  @Input() facebookMessengerUrl = '';
  @Input() linkedinShareUrl = '';
  @Input() twitterShareUrl = '';
  @Input() emailShareUrl = '';

  @Output() setOpenPopup = new EventEmitter<boolean>();

  closePopup() {
    this.setOpenPopup.emit(false);
  }
}

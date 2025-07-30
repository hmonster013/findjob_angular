import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-social-network-sharing-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './social-network-sharing-popup.component.html',
  styleUrls: ['./social-network-sharing-popup.component.css'],
})
export class SocialNetworkSharingPopupComponent implements OnInit {
  @Input() open = false;
  @Input() shareUrl: string = ''; // URL cần chia sẻ
  @Input() shareTitle: string = 'Check this out!'; // Tiêu đề chia sẻ
  @Output() setOpenPopup = new EventEmitter<boolean>();

  facebookShareUrl: string = '';
  facebookMessengerUrl: string = '';
  linkedinShareUrl: string = '';
  twitterShareUrl: string = '';
  emailShareUrl: string = '';

  ngOnInit() {
    // Lấy URL hiện tại nếu không có shareUrl
    const defaultUrl = this.shareUrl || window.location.href;
    const encodedUrl = encodeURIComponent(defaultUrl);
    const encodedTitle = encodeURIComponent(this.shareTitle);

    // Tạo URL chia sẻ cho các mạng xã hội
    this.facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    this.facebookMessengerUrl = `https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=YOUR_APP_ID&redirect_uri=${encodedUrl}`;
    this.linkedinShareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`;
    this.twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    this.emailShareUrl = `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;
  }

  closePopup() {
    this.setOpenPopup.emit(false);
  }
}

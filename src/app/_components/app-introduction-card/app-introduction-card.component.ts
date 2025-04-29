import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-app-introduction-card',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './app-introduction-card.component.html',
  styleUrl: './app-introduction-card.component.css'
})
export class AppIntroductionCardComponent {
  phoneNumber: string = '';
  isLoading: boolean = false;

  chPlayLink = 'https://play.google.com/store/apps/details?id=com.myjob';  // Đổi link nếu cần
  appStoreLink = 'https://apps.apple.com/app/idXXXXXXXXX';                // Đổi link nếu cần

  async handleSendSMS(event: Event) {
    event.preventDefault();

    if (!this.phoneNumber) {
      window.alert('Vui lòng nhập số điện thoại!');
      return;
    }

    const phoneRegex = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
    if (!phoneRegex.test(this.phoneNumber)) {
      window.alert('Số điện thoại không hợp lệ!');
      return;
    }

    try {
      this.isLoading = true;
      // Giả lập API
      await new Promise(resolve => setTimeout(resolve, 2000));
      window.alert('Gửi thành công. Vui lòng kiểm tra tin nhắn.');
      this.phoneNumber = '';
    } catch (error) {
      console.error(error);
      window.alert('Có lỗi xảy ra khi gửi SMS.');
    } finally {
      this.isLoading = false;
    }
  }
}

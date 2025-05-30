import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthStateService } from '../../_services/auth-state.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="chatbotHtml" class="fixed bottom-4 right-4 z-50">
      <div [innerHTML]="chatbotHtml" class="text-orange-600"></div>
    </div>
  `,
  styles: [
    `
      :host {
        @apply font-sans;
      }
      div {
        @apply bg-orange-100 rounded-lg shadow-lg p-2;
      }
    `,
  ],
})
export class ChatBotComponent implements OnInit {
  chatbotConfig: any = null;
  chatbotHtml: SafeHtml | null = null;

  constructor(
    private authStateService: AuthStateService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    // Lấy hostname
    const hostName = window.location.hostname;

    // Thiết lập chatbot config dựa trên hostname
    this.chatbotConfig =
      hostName === environment.EMPLOYER_FINDJOB_HOST_NAME
        ? environment.chatbot.employer
        : environment.chatbot.jobSeeker;

    // Tạo HTML cho df-messenger
    if (this.chatbotConfig) {
      const html = `<df-messenger
        intent="WELCOME"
        chat-title="${this.chatbotConfig.chatTitle}"
        agent-id="${this.chatbotConfig.agentId}"
        language-code="${this.chatbotConfig.languageCode}"
        chat-icon="${this.chatbotConfig.chatIcon}"
      ></df-messenger>`;
      this.chatbotHtml = this.sanitizer.bypassSecurityTrustHtml(html);
    }

    // Lắng nghe trạng thái đăng nhập (nếu cần)
    this.authStateService.getAuthStatus().subscribe((isAuthenticated) => {
      // Có thể thêm logic nếu chatbot chỉ hiển thị khi đăng nhập
      // Ví dụ: this.chatbotHtml = isAuthenticated ? this.chatbotHtml : null;
    });
  }
}

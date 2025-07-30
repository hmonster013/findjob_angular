import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeftSideBarComponent } from '../../_components/chats/left-side-bar/left-side-bar.component';
import { ChatWindowComponent } from '../../_components/chats/chat-window/chat-window.component';
import { RightSideBarComponent } from '../../_components/chats/right-side-bar/right-side-bar.component';
import { SidebarHeaderComponent } from '../../../_components/chats/sidebar-header/sidebar-header.component';
import { AuthStateService } from '../../../_services/auth-state.service';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [
    CommonModule,
    ChatWindowComponent,
    LeftSideBarComponent,
    RightSideBarComponent,
    SidebarHeaderComponent,
  ],
  templateUrl: './chat-page.component.html',
})
export class ChatPageComponent {
  openLeftDrawer = false;
  openRightDrawer = false;

  isMobile = window.innerWidth <= 640;
  isMedium = window.innerWidth <= 768;

  constructor(private auth: AuthStateService) {}

  get isEmployer(): boolean {
    return this.auth.getCurrentUser()?.roleName !== 'JOB_SEEKER';
  }

  toggleLeftDrawer() {
    this.openLeftDrawer = !this.openLeftDrawer;
  }

  toggleRightDrawer() {
    this.openRightDrawer = !this.openRightDrawer;
  }
}

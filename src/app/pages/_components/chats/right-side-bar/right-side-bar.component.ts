import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStateService } from '../../../../_services/auth-state.service';
import { FirebaseService } from '../../../../_services/firebase.service';
import { JobPostActivityService } from '../../../../_services/job-post-activity.service';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Router } from '@angular/router';

@Component({
  selector: 'app-right-side-bar',
  imports: [
    CommonModule
  ],
  templateUrl: './right-side-bar.component.html',
  styleUrl: './right-side-bar.component.css'
})
export class RightSideBarComponent {
  @Input() isEmployer: boolean = false;

  jobPostsApplied: any[] = [];
  loading = false;
  count = 0;
  page = 1;
  readonly pageSize = 12;
  currentUser: any;

  constructor(
    private authStateService: AuthStateService,
    private firebaseService: FirebaseService,
    private jobPostActivityService: JobPostActivityService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authStateService.getCurrentUser();
    this.fetchData();
  }

  fetchData() {
    this.loading = true;
    if (this.isEmployer) {
      this.jobPostActivityService.getAppliedResumeChat({
        page: this.page,
        pageSize: this.pageSize
      }).subscribe({
        next: (res: any) => {
          this.jobPostsApplied = res.data.results;
          this.count = res.data.count;
        },
        error: (err) => console.error(err),
        complete: () => this.loading = false
      });
    } else {
      this.jobPostActivityService.getJobPostChatActivity({
        page: this.page,
        pageSize: this.pageSize
      }).subscribe({
        next: (res: any) => {
          this.jobPostsApplied = res.data.results;
          this.count = res.data.count;
        },
        error: (err) => console.error(err),
        complete: () => this.loading = false
      });
    }
  }

  async handleChat(userData: any) {
    if (!this.currentUser) return;
    let allowCreateNewChatRoom = false;
    const isExists = await this.firebaseService.checkExists('accounts', userData.userId);

    if (!isExists) {
      const created = await this.firebaseService.createUser('accounts', userData, userData.userId);
      if (created) allowCreateNewChatRoom = true;
    } else {
      allowCreateNewChatRoom = true;
    }

    if (allowCreateNewChatRoom) {
      let chatRoomId = await this.firebaseService.checkChatRoomExists('chatRooms', this.currentUser.userId, userData.userId);
      if (!chatRoomId) {
        chatRoomId = await this.firebaseService.addDocument('chatRooms', {
          members: [this.currentUser.userId, userData.userId],
          membersString: [`${this.currentUser.userId}-${userData.userId}`, `${userData.userId}-${this.currentUser.userId}`],
          recipientId: userData.userId,
          createdBy: this.currentUser.userId,
          unreadCount: 0
        });
      }

      this.router.navigate(['/chat', chatRoomId]);
    }
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.fetchData();
  }

  get totalPages(): number {
    return Math.ceil(this.count / this.pageSize);
  }
}

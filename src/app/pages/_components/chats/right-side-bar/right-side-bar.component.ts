import { IMAGES } from './../../../../_configs/constants';
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStateService } from '../../../../_services/auth-state.service';
import { FirebaseService } from '../../../../_services/firebase.service';
import { JobPostActivityService } from '../../../../_services/job-post-activity.service';
import { ChatStateService } from '../../../../_services/chat-state.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-right-side-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './right-side-bar.component.html',
  styleUrl: './right-side-bar.component.css'
})
export class RightSideBarComponent implements OnInit {
  @Input() isEmployer: boolean = false;

  jobPostsApplied: any[] = [];
  loading = false;
  count = 0;
  page = 1;
  readonly pageSize = 12;
  currentUser: any;

  IMAGES = IMAGES;

  constructor(
    private authStateService: AuthStateService,
    private firebaseService: FirebaseService,
    private jobPostActivityService: JobPostActivityService,
    private chatStateService: ChatStateService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.currentUser = this.authStateService.getCurrentUser();
    if (!this.currentUser?.id) {
      this.toastr.error('Vui lòng đăng nhập để xem danh sách!');
      return;
    }
    this.fetchData();
  }

  fetchData() {
    this.loading = true;
    const params = { page: this.page, pageSize: this.pageSize };
    const request = this.isEmployer
      ? this.jobPostActivityService.getAppliedResumeChat(params)
      : this.jobPostActivityService.getJobPostChatActivity(params);

    request.subscribe({
      next: (res: any) => {
        this.jobPostsApplied = res.data.results
        console.log(this.jobPostsApplied)
        this.count = res.data.count;
      },
      error: (err) => {
        console.error('Lỗi khi lấy danh sách:', err);
        this.toastr.error('Không thể tải danh sách, vui lòng thử lại!');
      },
      complete: () => (this.loading = false)
    });
  }

  async handleChat(userData: any) {
    if (!this.currentUser?.id) {
      this.toastr.error('Vui lòng đăng nhập để nhắn tin!');
      return;
    }

    const userId = this.currentUser.id.toString();
    const partnerId = userData.userId.toString();

    let allowCreateNewChatRoom = false;
    const isExists = await this.firebaseService.checkExists('accounts', partnerId);

    if (!isExists) {
      const preparedUserData = {
        userId: partnerId,
        name: userData.fullName,
        email: userData.userEmail,
        avatarUrl: userData.avatarUrl || userData.companyImageUrl,
        company: this.isEmployer
          ? null
          : {
              companyId: userData.companyId,
              slug: userData.companySlug,
              companyName: userData.companyName,
              imageUrl: userData.companyImageUrl,
            },
      };

      const created = await this.firebaseService.createUser('accounts', preparedUserData, partnerId);
      if (created) {
        allowCreateNewChatRoom = true;
      } else {
        this.toastr.error('Không thể tạo tài khoản cho đối tác, vui lòng thử lại!');
        return;
      }
    } else {
      allowCreateNewChatRoom = true;
    }

    if (allowCreateNewChatRoom) {
      let chatRoomId = await this.firebaseService.checkChatRoomExists('chatRooms', userId, partnerId);
      if (!chatRoomId) {
        chatRoomId = await this.firebaseService.addDocument('chatRooms', {
          members: [userId, partnerId],
          membersString: [`${userId}-${partnerId}`, `${partnerId}-${userId}`],
          recipientId: partnerId,
          createdBy: userId,
          unreadCount: 0,
        });
      }

      this.chatStateService.setSelectedRoomId(chatRoomId);
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

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthStateService } from '../../../../_services/auth-state.service';
import { FirebaseService } from '../../../../_services/firebase.service';
import { ChatStateService } from '../../../../_services/chat-state.service';
import { ROUTES } from '../../../../_configs/constants';

@Component({
  selector: 'app-left-side-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.css'],
})
export class LeftSideBarComponent implements OnInit, OnDestroy {
  @Input() isEmployer: boolean = false;

  rooms: any[] = [];
  hasMore = true;
  loading = true;
  lastDoc: any = null;
  page = 0;
  count = 0;
  private readonly pageSize = 20;
  private readonly defaultAvatar = 'https://via.placeholder.com/54';
  private unsubscribeSnapshot: any;

  currentUser: any;
  searchText: string = '';

  constructor(
    private firebaseService: FirebaseService,
    private authStateService: AuthStateService,
    private chatStateService: ChatStateService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authStateService.getCurrentUser();
    if (!this.currentUser?.id) {
      this.toastr.error('Vui lòng đăng nhập để xem danh sách trò chuyện!');
      this.loading = false;
      return;
    }
    this.listenRooms();
  }

  ngOnDestroy() {
    if (this.unsubscribeSnapshot) {
      this.unsubscribeSnapshot();
    }
  }

  onSearch() {
    this.rooms = [];
    this.hasMore = true;
    this.lastDoc = null;
    this.page = 0;
    this.listenRooms();
  }

  listenRooms() {
    const userId = this.currentUser?.id?.toString();
    if (!userId) {
      this.toastr.error('Không tìm thấy thông tin người dùng!');
      this.loading = false;
      return;
    }

    if (this.unsubscribeSnapshot) {
      this.unsubscribeSnapshot();
    }

    this.loading = true;
    this.page = 0;

    try {
      this.unsubscribeSnapshot = this.firebaseService.listenChatRooms(
        userId,
        this.pageSize,
        this.searchText,
        async (chatRooms: any[], lastDoc: any, count: number) => {
          const roomsData: any[] = [];
          for (const room of chatRooms) {
            try {
              const partnerId =
                room.members[0] === userId ? room.members[1] : room.members[0];
              const userAccount = await this.firebaseService.getUserAccount('accounts', partnerId);

              const matchesSearch = this.searchText
                ? this.isEmployer
                  ? userAccount?.name?.toLowerCase().includes(this.searchText.toLowerCase())
                  : userAccount?.company?.companyName?.toLowerCase().includes(this.searchText.toLowerCase())
                : true;

              if (matchesSearch) {
                roomsData.push({
                  ...room,
                  user: userAccount || { name: '---', email: '---', company: null, avatarUrl: this.defaultAvatar },
                });
              }
            } catch (error) {
              console.error('listenChatRooms - Lỗi khi lấy thông tin người dùng:', error);
              roomsData.push({
                ...room,
                user: { name: '---', email: '---', company: null, avatarUrl: this.defaultAvatar },
              });
            }
          }

          this.rooms = roomsData;
          this.lastDoc = lastDoc;
          this.count = count;
          this.hasMore = chatRooms.length >= this.pageSize;
          this.page = 1;
          this.loading = false;
        }
      );
    } catch (error) {
      console.error('listenChatRooms - Lỗi khi nghe danh sách trò chuyện:', error);
      this.toastr.error('Không thể tải danh sách trò chuyện!');
      this.loading = false;
    }
  }

  async loadMore() {
    const userId = this.currentUser?.id?.toString();
    if (!this.hasMore || !userId || this.loading) return;

    if (Math.ceil(this.count / this.pageSize) <= this.page) {
      this.hasMore = false;
      return;
    }

    this.loading = true;
    try {
      const result = await this.firebaseService.getMoreChatRooms(
        userId,
        this.lastDoc,
        this.pageSize,
        this.searchText
      );
      const newRooms: any[] = [];
      for (const room of result.chatRooms) {
        try {
          const partnerId =
            room.members[0] === userId ? room.members[1] : room.members[0];
          const userAccount = await this.firebaseService.getUserAccount('accounts', partnerId);

          const matchesSearch = this.searchText
            ? this.isEmployer
              ? userAccount?.name?.toLowerCase().includes(this.searchText.toLowerCase())
              : userAccount?.company?.companyName?.toLowerCase().includes(this.searchText.toLowerCase())
            : true;

          if (matchesSearch) {
            newRooms.push({
              ...room,
              user: userAccount || { name: '---', email: '---', company: null, avatarUrl: this.defaultAvatar },
            });
          }
        } catch (error) {
          console.error('loadMore - Lỗi khi lấy thông tin người dùng:', error);
          newRooms.push({
            ...room,
            user: { name: '---', email: '---', company: null, avatarUrl: this.defaultAvatar },
          });
        }
      }

      this.rooms = [...this.rooms, ...newRooms];
      this.lastDoc = result.lastDoc;
      this.hasMore = newRooms.length >= this.pageSize;
      this.page += 1;
    } catch (error) {
      console.error('loadMore - Lỗi khi tải thêm trò chuyện:', error);
      this.toastr.error('Không thể tải thêm trò chuyện!');
    } finally {
      this.loading = false;
    }
  }

  navigateToRoom(room: any) {
    this.chatStateService.setSelectedRoomId(room.id);
  }
}

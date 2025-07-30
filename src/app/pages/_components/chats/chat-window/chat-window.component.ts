import { IMAGES } from './../../../../_configs/constants';
import { Component, ElementRef, ViewChild, OnInit, OnDestroy, Input } from '@angular/core';
import { collection, doc, limit, onSnapshot, orderBy, query, startAfter, updateDoc, where, getDocs } from 'firebase/firestore';
import { MessageComponent } from '../message/message.component';
import { ChatStateService } from '../../../../_services/chat-state.service';
import { FirebaseService } from '../../../../_services/firebase.service';
import { AuthStateService } from '../../../../_services/auth-state.service';
import { ToastrService } from 'ngx-toastr';
import { db } from '../../../../_configs/firebase-config';
import { EmptyCardComponent } from "../../../../_components/empty-card/empty-card.component";
import { ChatInfoComponent } from "../../../../_components/chats/chat-info/chat-info.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ROLES_NAME } from '../../../../_configs/constants';
import { Subscription, combineLatest } from 'rxjs';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [
    MessageComponent,
    ChatInfoComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css'
})
export class ChatWindowComponent implements OnInit, OnDestroy {
  @ViewChild('inputRef') inputRef!: ElementRef;
  @ViewChild('messageListRef') messageListRef!: ElementRef;

  @Input() showMobileHeader: boolean = false;
  @Input() onToggleLeftDrawer?: () => void;
  @Input() onToggleRightDrawer?: () => void;

  LIMIT = 20;
  currentUser: any;
  selectedRoom: any = {};
  partnerId: string | null = null;
  inputValue = '';
  isLoading = true;
  isLoadingRoom = false;
  isLoadingUser = true;
  hasMore = true;
  lastDocument: any = null;
  messages: any[] = [];
  page = 1;
  count = 0;

  ROLES_NAME = ROLES_NAME;
  IMAGES = IMAGES;

  private unsubscribeUnreadCount: (() => void) | null = null;
  private unsubscribeMessageCount: (() => void) | null = null;
  private unsubscribeMessages: (() => void) | null = null;
  private unsubscribeSelectedRoom: (() => void) | null = null;
  private subscription: Subscription = new Subscription();
  private shouldAutoScroll = true;
  private lastMessageCount = 0;

  constructor(
    private chatStateService: ChatStateService,
    private firebaseService: FirebaseService,
    private authStateService: AuthStateService,
    private toastr: ToastrService
  ) {
    this.currentUser = this.authStateService.getCurrentUser();
    console.log('Current User:', this.currentUser);
  }

  ngOnInit() {
    if (!this.currentUser?.id) {
      this.toastr.error('Vui lòng đăng nhập để sử dụng chat!');
      this.isLoading = false;
      this.isLoadingRoom = false;
      this.isLoadingUser = false;
      return;
    }

    this.subscription.add(
      combineLatest([this.chatStateService.currentUserChat$, this.chatStateService.selectedRoomId$]).subscribe(
        ([userChat, roomId]) => {
          this.currentUserChat = userChat;
          this.selectedRoomId = roomId;

          if (!userChat?.userId) {
            this.isLoadingUser = true;
            this.isLoadingRoom = false;
            this.isLoading = false;
            this.selectedRoom = {};
            this.messages = [];
            this.partnerId = null;
            return;
          }

          this.isLoadingUser = false;

          if (roomId) {
            this.isLoadingRoom = true;
            this.messages = [];
            this.lastDocument = null;
            this.page = 1;
            this.hasMore = true;
            this.selectedRoom = {};
            this.partnerId = null;
            this.listenRoomUnreadCount();
            this.listenSelectedRoom();
            this.listenMessageCount();
            this.listenMessages();
          } else {
            this.isLoadingRoom = false;
            this.isLoading = false;
            this.selectedRoom = {};
            this.messages = [];
            this.partnerId = null;
          }
        }
      )
    );
  }

  ngOnDestroy() {
    if (this.unsubscribeUnreadCount) {
      this.unsubscribeUnreadCount();
    }
    if (this.unsubscribeMessageCount) {
      this.unsubscribeMessageCount();
    }
    if (this.unsubscribeMessages) {
      this.unsubscribeMessages();
    }
    if (this.unsubscribeSelectedRoom) {
      this.unsubscribeSelectedRoom();
    }
    this.subscription.unsubscribe();
  }

  private _currentUserChat: any;
  get currentUserChat() {
    return this._currentUserChat;
  }
  set currentUserChat(value: any) {
    this._currentUserChat = value;
  }

  private _selectedRoomId: string = '';
  get selectedRoomId() {
    return this._selectedRoomId;
  }
  set selectedRoomId(value: string) {
    this._selectedRoomId = value;
  }

  ngAfterViewChecked() {
    // Only auto scroll if we should and there are new messages
    if (this.shouldAutoScroll && this.messages.length > this.lastMessageCount) {
      this.scrollToBottom();
      this.lastMessageCount = this.messages.length;
    }
  }

  private scrollToBottom() {
    if (this.messageListRef && this.messageListRef.nativeElement) {
      const element = this.messageListRef.nativeElement;
      setTimeout(() => {
        element.scrollTop = element.scrollHeight;
      }, 50);
    }
  }

  checkScrollPosition() {
    if (this.messageListRef && this.messageListRef.nativeElement) {
      const element = this.messageListRef.nativeElement;
      const threshold = 100; // pixels from bottom
      const isNearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < threshold;
      this.shouldAutoScroll = isNearBottom;
    }
  }

  listenRoomUnreadCount() {
    if (this.unsubscribeUnreadCount) {
      this.unsubscribeUnreadCount();
    }

    if (!this.selectedRoomId || !this.currentUserChat?.userId) {
      return;
    }

    const chatRoomDocRef = doc(db, 'chatRooms', this.selectedRoomId);
    this.unsubscribeUnreadCount = onSnapshot(chatRoomDocRef, (docSnap) => {
      const { recipientId, unreadCount } = docSnap.data() || {};
      const userId = this.currentUserChat.userId?.toString();
      if (recipientId === userId && unreadCount > 0) {
        updateDoc(chatRoomDocRef, { unreadCount: 0 }).catch((error) => {
          this.toastr.error('Không thể đặt lại số tin nhắn chưa đọc!');
        });
      }
    }, (error) => {
      this.toastr.error('Không thể cập nhật trạng thái chat!');
    });
  }

  listenSelectedRoom() {
    if (this.unsubscribeSelectedRoom) {
      this.unsubscribeSelectedRoom();
    }

    if (!this.selectedRoomId) {
      this.selectedRoom = {};
      this.partnerId = null;
      this.isLoadingRoom = false;
      return;
    }

    if (!this.currentUserChat?.userId) {
      this.selectedRoom = {};
      this.partnerId = null;
      this.isLoadingRoom = false;
      return;
    }

    const userId = this.currentUserChat.userId.toString();
    const chatRoomDocRef = doc(db, 'chatRooms', this.selectedRoomId);
    this.unsubscribeSelectedRoom = onSnapshot(chatRoomDocRef, async (docSnap) => {
      if (docSnap.exists()) {
        const chatRoomData = docSnap.data();
        const members: string[] = chatRoomData?.['members'] || [];
        if (!members || members.length < 2) {
          this.toastr.error('Dữ liệu phòng chat không hợp lệ!');
          this.selectedRoom = {};
          this.partnerId = null;
          this.isLoadingRoom = false;
          return;
        }

        const partnerId = members[0] === userId ? members[1] : members[0];

        try {
          const userAccount = await this.firebaseService.getUserAccount('accounts', partnerId);

                     const defaultUser = {
             name: '---',
             email: '---',
             company: null,
             avatarUrl: IMAGES.imageDefault,
             userId: partnerId
           };

          this.selectedRoom = {
            ...chatRoomData,
            id: docSnap.id,
            user: userAccount ? { ...defaultUser, ...userAccount } : defaultUser
          };
          this.partnerId = partnerId;
        } catch (error) {
          this.toastr.error('Không thể lấy thông tin người dùng!');
          this.selectedRoom = {
            ...chatRoomData,
            id: docSnap.id,
            user: {
              name: '---',
              email: '---',
              company: null,
              avatarUrl: 'https://via.placeholder.com/54',
              userId: partnerId
            }
          };
          this.partnerId = partnerId;
        }
      } else {
        this.toastr.error('Phòng chat không tồn tại!');
        this.selectedRoom = {};
        this.partnerId = null;
      }
      this.isLoadingRoom = false;
    }, (error) => {
      this.toastr.error('Không thể lấy thông tin phòng chat!');
      this.selectedRoom = {};
      this.partnerId = null;
      this.isLoadingRoom = false;
    });
  }

  listenMessageCount() {
    if (this.unsubscribeMessageCount) {
      this.unsubscribeMessageCount();
    }

    if (!this.selectedRoomId) {
      return;
    }

    const q = query(collection(db, 'messages'), where('roomId', '==', this.selectedRoomId));
    this.unsubscribeMessageCount = onSnapshot(q, (querySnapshot) => {
      this.count = querySnapshot.size || 0;
    }, (error) => {
      this.toastr.error('Không thể đếm số tin nhắn!');
    });
  }

  listenMessages() {
    if (this.unsubscribeMessages) {
      this.unsubscribeMessages();
    }

    if (!this.selectedRoomId) {
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    const q = query(
      collection(db, 'messages'),
      where('roomId', '==', this.selectedRoomId),
      orderBy('createdAt', 'desc'),
      limit(this.LIMIT)
    );

    this.unsubscribeMessages = onSnapshot(q, (querySnapshot) => {
      const messagesData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return { ...data, id: doc.id };
      });
      if (querySnapshot.docs.length > 0) {
        this.lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1];
      }
            this.messages = messagesData;
      this.page = 1;
      this.hasMore = messagesData.length >= this.LIMIT;
      this.isLoading = false;
      this.lastMessageCount = this.messages.length;

      // Scroll to bottom when messages are loaded for the first time
      this.shouldAutoScroll = true;
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    }, (error) => {
      this.toastr.error('Không thể tải danh sách tin nhắn!');
      this.isLoading = false;
    });
  }

  async handleLoadMore() {
    if (!this.hasMore || !this.lastDocument) return;

    try {
      const q = query(
        collection(db, 'messages'),
        where('roomId', '==', this.selectedRoomId),
        orderBy('createdAt', 'desc'),
        startAfter(this.lastDocument),
        limit(this.LIMIT)
      );
      const querySnapshot = await getDocs(q);
      const messagesData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      if (querySnapshot.docs.length > 0) {
        this.lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1];
        this.messages = [...this.messages, ...messagesData];
        this.page += 1;
        this.hasMore = messagesData.length >= this.LIMIT;
      } else {
        this.hasMore = false;
      }
    } catch (error) {
      this.toastr.error('Không thể tải thêm tin nhắn!');
    }
  }

  handleInputChange(event: any) {
    this.inputValue = event.target.value;
  }

  async handleOnSubmit(event: Event) {
    event.preventDefault();
    if (this.inputValue.trim() !== '' && this.currentUserChat?.userId && this.partnerId) {
      try {
        const userId = this.currentUserChat.userId.toString();
        const now = new Date();
        const newMessage = {
          text: this.inputValue,
          userId: userId,
          roomId: this.selectedRoomId,
          createdAt: {
            seconds: Math.floor(now.getTime() / 1000),
            nanoseconds: 0
          },
          id: `temp-${Date.now()}`,
          isPending: true
        };

        this.messages = [newMessage, ...this.messages];

        await this.firebaseService.addDocument('messages', {
          text: this.inputValue,
          userId: userId,
          roomId: this.selectedRoomId,
        });
        await this.firebaseService.updateChatRoomByPartnerId(this.partnerId, this.selectedRoomId);

        this.inputValue = '';
        // Always scroll to bottom when sending a message
        this.shouldAutoScroll = true;
        setTimeout(() => {
          this.inputRef.nativeElement.focus();
          this.scrollToBottom();
        });
      } catch (error) {
        this.toastr.error('Không thể gửi tin nhắn, vui lòng thử lại!');
      }
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.handleOnSubmit(event);
    }
  }

  trackByMessageId(index: number, message: any): string {
    return message.id;
  }

  autoResize(event: any) {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px';
  }

  get isEmployer(): boolean {
    return this.currentUser?.roleName === ROLES_NAME.EMPLOYER;
  }

    getAvatarUrl(user: any): string {
    if (!user) return IMAGES.imageDefault;

    if (user.roleName === 'EMPLOYER') {
      return user.company?.imageUrl || user.avatarUrl || IMAGES.imageDefault;
    }

    if (user.roleName === 'JOB_SEEKER') {
      return user.avatarUrl || IMAGES.imageDefault;
    }

    return IMAGES.imageDefault;
  }



  getMessageAvatarUrl(messageUserId: string): string {
    if (!messageUserId) return IMAGES.imageDefault;

    // Nếu tin nhắn là của người dùng hiện tại
    if (this.currentUserChat?.userId?.toString() === messageUserId) {
      return this.getAvatarUrl(this.currentUser);
    }

    // Nếu tin nhắn là của đối phương (partner)
    if (this.selectedRoom?.user) {
      return this.getAvatarUrl(this.selectedRoom.user);
    }

    return IMAGES.imageDefault;
  }
}

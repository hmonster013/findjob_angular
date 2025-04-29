import { Component, ElementRef, ViewChild } from '@angular/core';

import { collection, doc, limit, onSnapshot, orderBy, query, startAfter, updateDoc, where, getDocs } from 'firebase/firestore';
import { MessageComponent } from '../message/message.component';
import { ChatStateService } from '../../../../_services/chat-state.service';
import { FirebaseService } from '../../../../_services/firebase.service';
import { AuthStateService } from '../../../../_services/auth-state.service';
import { db } from '../../../../_configs/firebase-config';
import { EmptyCardComponent } from "../../../../_components/empty-card/empty-card.component";
import { ChatInfoComponent } from "../../../../_components/chats/chat-info/chat-info.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ROLES_NAME } from '../../../../_configs/constants';

@Component({
  selector: 'app-chat-window',
  imports: [
    MessageComponent,
    EmptyCardComponent,
    ChatInfoComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css'
})
export class ChatWindowComponent {
  @ViewChild('inputRef') inputRef!: ElementRef;
  @ViewChild('messageListRef') messageListRef!: ElementRef;

  LIMIT = 20;
  currentUser: any;
  selectedRoom: any = {};
  partnerId: string | null = null;
  inputValue = '';
  isLoading = true;
  hasMore = true;
  lastDocument: any = null;
  messages: any[] = [];
  page = 1;
  count = 0;

  ROLES_NAME = ROLES_NAME;
  constructor(
    private chatStateService: ChatStateService,
    private firebaseService: FirebaseService,
    private authStateService: AuthStateService
  ) {
    this.currentUser = this.authStateService.getCurrentUser();
  }

  ngOnInit() {
    this.listenRoomUnreadCount();
    this.getSelectedRoom();
    this.listenMessageCount();
    this.listenMessages();
  }

  ngAfterViewChecked() {
    if (this.messageListRef) {
      this.messageListRef.nativeElement.scrollTop = this.messageListRef.nativeElement.scrollHeight + 50;
    }
  }

  get currentUserChat() {
    return this.chatStateService.currentUserChat;
  }

  get selectedRoomId() {
    return this.chatStateService.selectedRoomId;
  }

  listenRoomUnreadCount() {
    if (this.selectedRoomId && this.currentUserChat) {
      const chatRoomDocRef = doc(db, 'chatRooms', `${this.selectedRoomId}`);
      onSnapshot(chatRoomDocRef, (docSnap) => {
        const { recipientId, unreadCount } = docSnap.data() || {};
        if (recipientId === `${this.currentUserChat.userId}` && unreadCount > 0) {
          updateDoc(chatRoomDocRef, { unreadCount: 0 });
        }
      });
    }
  }

  async getSelectedRoom() {
    if (this.selectedRoomId && this.currentUserChat) {
      const selectRoom = await this.firebaseService.getChatRoomById(this.selectedRoomId, this.currentUserChat.userId);
      this.selectedRoom = selectRoom;
      this.partnerId = selectRoom?.user?.userId;
    }
  }

  listenMessageCount() {
    if (this.selectedRoomId) {
      const q = query(collection(db, 'messages'), where('roomId', '==', `${this.selectedRoomId}`));
      onSnapshot(q, (querySnapshot) => {
        this.count = querySnapshot.size || 0;
      });
    }
  }

  listenMessages() {
    this.isLoading = true;
    const q = query(
      collection(db, 'messages'),
      where('roomId', '==', `${this.selectedRoomId}`),
      orderBy('createdAt', 'desc'),
      limit(this.LIMIT)
    );

    onSnapshot(q, (querySnapshot) => {
      const messagesData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      if (querySnapshot.docs.length > 0) {
        this.lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1];
      }
      this.messages = messagesData;
      this.page = 1;
      this.hasMore = true;
      this.isLoading = false;
    });
  }

  handleLoadMore() {
    if (this.lastDocument !== null) {
      const q = query(
        collection(db, 'messages'),
        where('roomId', '==', `${this.selectedRoomId}`),
        orderBy('createdAt', 'desc'),
        startAfter(this.lastDocument),
        limit(this.LIMIT)
      );
      getDocs(q).then((querySnapshot) => {
        if (querySnapshot.docs.length > 0) {
          this.lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1];
          const messagesData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          this.messages = [...this.messages, ...messagesData];
          if (Math.ceil(this.count / this.LIMIT) <= this.page) {
            this.hasMore = false;
          } else {
            this.page += 1;
          }
        }
      });
    }
  }

  handleInputChange(event: any) {
    this.inputValue = event.target.value;
  }

  handleOnSubmit(event: Event) {
    event.preventDefault();
    if (this.inputValue.trim() !== '') {
      this.firebaseService.addDocument('messages', {
        text: this.inputValue,
        userId: `${this.currentUserChat?.userId}`,
        roomId: this.selectedRoomId,
      });
      this.firebaseService.updateChatRoomByPartnerId(this.partnerId!, this.selectedRoomId);
      this.inputValue = '';
      setTimeout(() => {
        this.inputRef.nativeElement.focus();
      });
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.handleOnSubmit(event);
    }
  }
}

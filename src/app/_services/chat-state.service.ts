import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthStateService } from './auth-state.service';
import { FirebaseService } from './firebase.service';
import { ROLES_NAME } from '../_configs/constants';

@Injectable({
  providedIn: 'root'
})
export class ChatStateService {
  private currentUserChatSubject = new BehaviorSubject<any>(null);
  private selectedRoomIdSubject = new BehaviorSubject<string>('');

  currentUserChat$ = this.currentUserChatSubject.asObservable();
  selectedRoomId$ = this.selectedRoomIdSubject.asObservable();

  constructor(
    private authStateService: AuthStateService,
    private firebaseService: FirebaseService
  ) {
    this.initCurrentUserChat();
  }

  private async initCurrentUserChat() {
    const currentUser = this.authStateService.getCurrentUser();
    if (!currentUser) {
      return;
    }

    const userId = currentUser.id;
    const isExists = await this.firebaseService.checkExists('accounts', userId);

    if (!isExists) {
      // Tạo mới user trên Firestore
      let userData: any = null;
      const roleName = currentUser.roleName;
      if (roleName === ROLES_NAME.JOB_SEEKER) {
        userData = {
          userId: userId,
          name: currentUser.fullName,
          email: currentUser.email,
          avatarUrl: currentUser.avatarUrl,
          company: null,
        };
      } else {
        userData = {
          userId: userId,
          name: currentUser.fullName,
          email: currentUser.email,
          avatarUrl: currentUser.company?.imageUrl,
          company: {
            companyId: currentUser.company?.id,
            slug: currentUser.company?.slug,
            companyName: currentUser.company?.companyName,
            imageUrl: currentUser.company?.imageUrl,
          },
        };
      }

      await this.firebaseService.createUser('accounts', userData, userId);
      console.log('CREATE USER TRÊN FIRESTORE: SUCCESS');
    }

    // Lấy thông tin user hiện tại
    const userChat = await this.firebaseService.getUserAccount('accounts', userId);
    this.currentUserChatSubject.next(userChat);
    console.log('userChat: ', userChat);
  }

  setSelectedRoomId(roomId: string) {
    this.selectedRoomIdSubject.next(roomId);
  }

  get currentUserChat() {
    return this.currentUserChatSubject.value;
  }

  get selectedRoomId() {
    return this.selectedRoomIdSubject.value;
  }
}

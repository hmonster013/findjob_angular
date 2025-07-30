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

  private async initCurrentUserChat(retryCount = 0, maxRetries = 3) {
    const currentUser = this.authStateService.getCurrentUser();
    if (!currentUser?.id) {
      this.currentUserChatSubject.next(null);
      return;
    }

    // Chuẩn hóa userId thành chuỗi
    const userId = currentUser.id.toString();

    try {
      const isExists = await this.firebaseService.checkExists('accounts', userId);

      if (!isExists) {
        // Tạo mới user trên Firestore
        let userData: any = null;
        const roleName = currentUser.roleName;
        if (roleName === ROLES_NAME.JOB_SEEKER) {
          userData = {
            userId: userId, // Lưu userId dạng chuỗi
            name: currentUser.fullName || 'Người dùng',
            email: currentUser.email || 'unknown@example.com',
            avatarUrl: currentUser.avatarUrl || null,
            company: null,
          };
        } else {
          userData = {
            userId: userId, // Lưu userId dạng chuỗi
            name: currentUser.fullName || 'Nhà tuyển dụng',
            email: currentUser.email || 'unknown@example.com',
            avatarUrl: currentUser.company?.imageUrl || null,
            company: {
              companyId: currentUser.company?.id?.toString() || null,
              slug: currentUser.company?.slug || null,
              companyName: currentUser.company?.companyName || 'Công ty chưa xác định',
              imageUrl: currentUser.company?.imageUrl || null,
            },
          };
        }

        const created = await this.firebaseService.createUser('accounts', userData, userId);
        if (!created) {
          throw new Error('Tạo user trên Firestore thất bại');
        }
      }

      // Lấy thông tin user hiện tại
      const userChat = await this.firebaseService.getUserAccount('accounts', userId);
      if (userChat) {
        this.currentUserChatSubject.next(userChat);
      } else {
        throw new Error('Không thể lấy userChat, tài liệu không tồn tại');
      }
    } catch (error) {
      if (retryCount < maxRetries) {
        setTimeout(() => this.initCurrentUserChat(retryCount + 1, maxRetries), 1000);
      } else {
        this.currentUserChatSubject.next(null);
      }
    }
  }

  setSelectedRoomId(roomId: string) {
    if (roomId && typeof roomId === 'string' && roomId.trim() !== '') {
      this.selectedRoomIdSubject.next(roomId);
    }
  }

  get currentUserChat() {
    return this.currentUserChatSubject.value;
  }

  get selectedRoomId() {
    return this.selectedRoomIdSubject.value;
  }
}

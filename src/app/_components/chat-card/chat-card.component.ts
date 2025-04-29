import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '../../_configs/constants';
import { CommonModule } from '@angular/common';
import { Firestore } from '@angular/fire/firestore';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

@Component({
  selector: 'app-chat-card',
  imports: [
    CommonModule
  ],
  templateUrl: './chat-card.component.html',
  styleUrl: './chat-card.component.css'
})
export class ChatCardComponent {
  unreadCount: number = 0;
  currentUser: any;
  private unsubscribe: any;

  constructor(
    private firestore: Firestore,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getCurrentUser();

    if (this.currentUser?.id) {
      const chatRoomsRef = collection(this.firestore, 'chatRooms');
      const q = query(
        chatRoomsRef,
        where('recipientId', '==', `${this.currentUser.id}`),
        where('unreadCount', '>', 0)
      );

      this.unsubscribe = onSnapshot(q, (querySnapshot) => {
        let total = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          total += data['unreadCount'] || 0;
        });

        this.unreadCount = total;
      });
    }
  }

  ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  getCurrentUser() {
    // Fake lấy từ LocalStorage / Service, bạn thay bằng service thực
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  handleRedirect() {
    if (this.currentUser?.roleName === 'Employer') {
      this.router.navigate(['/employer/chat']);
    } else {
      this.router.navigate(['/job-seeker/chat']);
    }
  }
}

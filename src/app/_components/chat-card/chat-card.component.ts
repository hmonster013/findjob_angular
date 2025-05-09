import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ROLES_NAME, ROUTES } from '../../_configs/constants';
import { CommonModule } from '@angular/common';
import { Firestore } from '@angular/fire/firestore';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { AuthStateService } from '../../_services/auth-state.service';
import { FirebaseService } from '../../_services/firebase.service';
import { db } from '../../_configs/firebase-config';

@Component({
  selector: 'app-chat-card',
  imports: [
    CommonModule
  ],
  templateUrl: './chat-card.component.html',
  styleUrl: './chat-card.component.css'
})
export class ChatCardComponent {
  unreadCount = 0;
  private unsubscribe: () => void = () => {};

  constructor(
    private authService: AuthStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.id) return;

    const chatRoomRef = collection(db, 'chatRooms');
    const q = query(
      chatRoomRef,
      where('recipientId', '==', `${currentUser.id}`),
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

  handleRedirect(): void {
    const role = this.authService.getCurrentUser()?.roleName;
    if (role === ROLES_NAME.EMPLOYER) {
      this.router.navigate([`/${ROUTES.EMPLOYER.CHAT}`]);
    } else {
      this.router.navigate([`/${ROUTES.JOB_SEEKER.CHAT}`]);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe?.();
  }
}

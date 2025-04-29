import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Database, ref, get, child, remove, update, query, orderByChild, limitToLast } from '@angular/fire/database';
import { AuthStateService } from '../../_services/auth-state.service';
@Component({
  selector: 'app-notification-card',
  imports: [
    CommonModule
  ],
  templateUrl: './notification-card.component.html',
  styleUrl: './notification-card.component.css'
})
export class NotificationCardComponent {
  open = false;
  notifications: any[] = [];
  unreadCount: number = 0;
  pageSize: number = 5;
  canLoadMore: boolean = false;

  constructor(
    private db: Database,
    private authStateService: AuthStateService
  ) {}

  ngOnInit() {
    this.fetchNotifications();
  }

  toggleMenu() {
    this.open = !this.open;
  }

  async fetchNotifications() {
    const user = this.authStateService.getCurrentUser();
    if (!user) return;

    const userId = user.id;
    const dbRef = ref(this.db);
    const notiRef = query(
      child(dbRef, `users/${userId}/notifications`),
      orderByChild('createdAt'),
      limitToLast(this.pageSize)
    );

    const snapshot = await get(notiRef);
    const data = snapshot.val();

    if (data) {
      const items = Object.entries(data).map(([key, value]: [string, any]) => ({
        id: key,
        ...value
      })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      this.notifications = items;
      this.unreadCount = items.filter(item => !item.isRead).length;
      this.canLoadMore = items.length >= this.pageSize;
    }
  }

  async loadMore() {
    this.pageSize += 5;
    this.fetchNotifications();
  }

  async markAsRead(notification: any) {
    const user = this.authStateService.getCurrentUser();
    if (!user) return;

    const userId = user.id;

    if (!notification.isRead) {
      const notiPath = `users/${userId}/notifications/${notification.id}`;
      await update(ref(this.db, notiPath), { isRead: true });
    }

    this.open = false;
    if (notification.redirectUrl) {
      window.location.href = notification.redirectUrl;
    }
  }

  async clearAll() {
    const user = this.authStateService.getCurrentUser();
    if (!user) return;

    const userId = user.id;
    const notiPath = `users/${userId}/notifications`;
    await remove(ref(this.db, notiPath));

    this.notifications = [];
    this.unreadCount = 0;
    this.open = false;
  }
}

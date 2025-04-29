import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { collection, doc, getDocs, limit, onSnapshot, orderBy, query, startAfter, updateDoc, where, writeBatch } from 'firebase/firestore';
import { db } from '../../../../_configs/firebase-config';
import { ROUTES } from '../../../../_configs/constants';
import { formatRoute } from '../../../../_utils/func-utils';

@Component({
  selector: 'app-notification-card',
  imports: [
    CommonModule
  ],
  templateUrl: './notification-card.component.html',
  styleUrl: './notification-card.component.css'
})
export class NotificationCardComponent {
  @Input() title: string = '';

  notifications: any[] = [];
  isLoading = false;
  count = 0;
  lastKey: any = null;
  PAGE_SIZE = 10;

  constructor(private router: Router) {}

  ngOnInit() {
    this.listenCount();
    this.loadNotifications();
  }

  get currentUserId(): string | null {
    const user = JSON.parse(localStorage.getItem('current_user') || '{}');
    return user?.id || null;
  }

  get pageCount(): number {
    return Math.ceil(this.count / this.PAGE_SIZE);
  }

  listenCount() {
    if (!this.currentUserId) return;
    const notiRef = collection(db, 'users', `${this.currentUserId}`, 'notifications');
    const q = query(notiRef, where('is_deleted', '==', false));

    onSnapshot(q, (snapshot) => {
      this.count = snapshot.size;
    });
  }

  loadNotifications() {
    if (!this.currentUserId) return;
    this.isLoading = true;

    const notiRef = collection(db, 'users', `${this.currentUserId}`, 'notifications');
    const first = query(notiRef, where('is_deleted', '==', false), orderBy('time', 'desc'), limit(this.PAGE_SIZE));

    onSnapshot(first, (snapshot) => {
      const notiList: any[] = [];
      snapshot.forEach((doc) => {
        notiList.push({ ...doc.data(), key: doc.id });
      });
      this.notifications = notiList;
      this.lastKey = snapshot.docs[snapshot.docs.length - 1];
      this.isLoading = false;
    });
  }

  async loadMore() {
    if (!this.currentUserId || !this.lastKey) return;

    const notiRef = collection(db, 'users', `${this.currentUserId}`, 'notifications');
    const nextQuery = query(notiRef, where('is_deleted', '==', false), orderBy('time', 'desc'), startAfter(this.lastKey), limit(this.PAGE_SIZE));
    const snapshot = await getDocs(nextQuery);

    const nextList: any[] = [];
    snapshot.forEach((doc) => {
      nextList.push({ ...doc.data(), key: doc.id });
    });

    this.notifications = [...this.notifications, ...nextList];
    this.lastKey = snapshot.docs[snapshot.docs.length - 1];
  }

  async markAllRead() {
    if (!this.currentUserId) return;

    const notiRef = collection(db, 'users', `${this.currentUserId}`, 'notifications');
    const readQuery = query(notiRef, where('is_read', '==', false));
    const snapshot = await getDocs(readQuery);

    const batch = writeBatch(db);
    snapshot.forEach((doc) => {
      batch.update(doc.ref, { is_read: true });
    });
    await batch.commit();
  }

  async removeNotification(key: string) {
    if (!this.currentUserId) return;
    await updateDoc(doc(db, 'users', `${this.currentUserId}`, 'notifications', key), { is_deleted: true });
    this.notifications = this.notifications.filter(n => n.key !== key);
  }

  async removeAllNotifications() {
    if (!this.currentUserId) return;
    const notiRef = collection(db, 'users', `${this.currentUserId}`, 'notifications');
    const deleteQuery = query(notiRef, where('is_deleted', '==', false));
    const snapshot = await getDocs(deleteQuery);

    const batch = writeBatch(db);
    snapshot.forEach((doc) => {
      batch.update(doc.ref, { is_deleted: true });
    });
    await batch.commit();
  }

  async markRead(key: string) {
    if (!this.currentUserId) return;
    await updateDoc(doc(db, 'users', `${this.currentUserId}`, 'notifications', key), { is_read: true });
  }

  handleClick(item: any) {
    if (!item?.key) return;
    this.markRead(item.key);

    switch (item.type) {
      case 'SYSTEM':
        this.router.navigate(['/']);
        break;
      case 'EMPLOYER_VIEWED_RESUME':
      case 'EMPLOYER_SAVED_RESUME':
        this.router.navigate([`/${ROUTES.JOB_SEEKER.DASHBOARD}/${ROUTES.JOB_SEEKER.MY_COMPANY}`]);
        break;
      case 'APPLY_STATUS':
        this.router.navigate([`/${ROUTES.JOB_SEEKER.DASHBOARD}/${ROUTES.JOB_SEEKER.MY_JOB}`]);
        break;
      case 'COMPANY_FOLLOWED':
        this.router.navigate([`/${ROUTES.EMPLOYER.PROFILE}`]);
        break;
      case 'POST_VERIFY_RESULT':
        this.router.navigate([`/${ROUTES.EMPLOYER.JOB_POST}`]);
        break;
      case 'APPLY_JOB':
        if (item['APPLY_JOB']?.resume_slug) {
          this.router.navigate([`/${formatRoute(ROUTES.EMPLOYER.PROFILE_DETAIL, item['APPLY_JOB'].resume_slug)}`]);
        }
        break;
    }
  }
}

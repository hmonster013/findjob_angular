import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { collection, query, where, orderBy, limit, onSnapshot, getDocs, startAfter, updateDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '../../_configs/firebase-config';
import { AuthStateService } from '../../_services/auth-state.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ROUTES } from '../../_configs/constants';
import { formatRoute } from '../../_utils/func-utils';

interface Notification {
  id: string;
  title: string;
  content: string;
  image?: string;
  time: any; // Firestore Timestamp hoặc Date
  is_read: boolean;
  is_deleted: boolean;
  type: string;
  [key: string]: any; // Để hỗ trợ các trường động như APPLY_JOB
}

@Component({
  selector: 'app-notification-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.css'],
})
export class NotificationCardComponent {
  open = false;
  notifications: Notification[] = [];
  unreadCount = 0;
  pageSize = 5;
  lastKey: any = null;
  canLoadMore = false;
  @Output() closed = new EventEmitter<void>();

  private unsubscribe: (() => void) | null = null;

  constructor(
    private authStateService: AuthStateService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.fetchNotifications();
  }

  ngOnDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  toggleMenu() {
    this.open = !this.open;
    if (!this.open) {
      this.closed.emit();
    }
  }

  private getUserId(): string | null {
    const user = this.authStateService.getCurrentUser();
    return user?.id ? String(user.id) : null;
  }

  fetchNotifications() {
    const userId = this.getUserId();
    if (!userId) {
      this.toastr.error('Vui lòng đăng nhập để xem thông báo!');
      this.notifications = [];
      this.unreadCount = 0;
      this.canLoadMore = false;
      return;
    }

    const notiRef = collection(db, 'users', userId, 'notifications');
    const q = query(
      notiRef,
      where('is_deleted', '==', false),
      orderBy('time', 'desc'),
      limit(this.pageSize)
    );

    this.unsubscribe = onSnapshot(q, (snapshot) => {
      const notiList: Notification[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Chuyển Timestamp thành Date
        if (data['time'] && data['time'].toDate) {
          data['time'] = data['time'].toDate();
        }
        notiList.push({ ...data, id: doc.id } as Notification);
      });
      this.notifications = notiList;
      this.unreadCount = notiList.filter(item => !item.is_read).length;
      this.lastKey = snapshot.docs[snapshot.docs.length - 1];
      this.canLoadMore = notiList.length >= this.pageSize;
    }, (error) => {
      console.error('Lỗi khi tải thông báo:', error);
      this.toastr.error('Không thể tải danh sách thông báo!');
      this.notifications = [];
      this.unreadCount = 0;
      this.canLoadMore = false;
    });
  }

  async loadMore() {
    const userId = this.getUserId();
    if (!userId || !this.lastKey) return;

    const notiRef = collection(db, 'users', userId, 'notifications');
    const nextQuery = query(
      notiRef,
      where('is_deleted', '==', false),
      orderBy('time', 'desc'),
      startAfter(this.lastKey),
      limit(this.pageSize)
    );

    try {
      const snapshot = await getDocs(nextQuery);
      const nextList: Notification[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data['time'] && data['time'].toDate) {
          data['time'] = data['time'].toDate();
        }
        nextList.push({ ...data, id: doc.id } as Notification);
      });
      this.notifications = [...this.notifications, ...nextList];
      this.unreadCount = this.notifications.filter(item => !item.is_read).length;
      this.lastKey = snapshot.docs[snapshot.docs.length - 1];
      this.canLoadMore = nextList.length >= this.pageSize;
    } catch (error) {
      console.error('Lỗi khi tải thêm thông báo:', error);
      this.toastr.error('Không thể tải thêm thông báo!');
    }
  }

  async markAsRead(notification: Notification) {
    const userId = this.getUserId();
    if (!userId || notification.is_read) return;

    try {
      const notiPath = doc(db, 'users', userId, 'notifications', notification.id);
      await updateDoc(notiPath, { is_read: true });
      this.open = false;
      this.closed.emit();
      this.navigateByType(notification);
    } catch (error) {
      console.error('Lỗi khi đánh dấu đã đọc:', error);
      this.toastr.error('Không thể đánh dấu thông báo là đã đọc!');
    }
  }

  async clearAll() {
    const userId = this.getUserId();
    if (!userId) return;

    try {
      const notiRef = collection(db, 'users', userId, 'notifications');
      const deleteQuery = query(notiRef, where('is_deleted', '==', false));
      const snapshot = await getDocs(deleteQuery);

      const batch = writeBatch(db);
      snapshot.forEach((doc) => {
        batch.update(doc.ref, { is_deleted: true });
      });
      await batch.commit();

      this.notifications = [];
      this.unreadCount = 0;
      this.canLoadMore = false;
      this.open = false;
      this.closed.emit();
      this.toastr.success('Đã xóa tất cả thông báo!');
    } catch (error) {
      console.error('Lỗi khi xóa tất cả thông báo:', error);
      this.toastr.error('Không thể xóa tất cả thông báo!');
    }
  }

  private navigateByType(notification: Notification) {
    if (!notification.type) {
      this.toastr.warning('Thông báo không hợp lệ!');
      return;
    }

    switch (notification.type) {
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
        if (notification['APPLY_JOB']?.resume_slug) {
          this.router.navigate([`/${formatRoute(ROUTES.EMPLOYER.PROFILE_DETAIL, notification['APPLY_JOB'].resume_slug)}`]);
        } else {
          this.toastr.warning('Không tìm thấy thông tin hồ sơ!');
        }
        break;
      default:
        this.toastr.warning('Loại thông báo không được hỗ trợ!');
        break;
    }
  }
}

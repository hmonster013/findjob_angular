import { IMAGES } from './../../../../_configs/constants';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { collection, doc, getDocs, limit, onSnapshot, orderBy, query, startAfter, updateDoc, where, writeBatch } from 'firebase/firestore';
import { ToastrService } from 'ngx-toastr';
import { db } from '../../../../_configs/firebase-config';
import { ROUTES } from '../../../../_configs/constants';
import { formatRoute } from '../../../../_utils/func-utils';
import { AuthStateService } from '../../../../_services/auth-state.service';

@Component({
  selector: 'app-notification-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.css']
})
export class NotificationCardComponent {
  @Input() title: string = '';

  notifications: any[] = [];
  isLoading = false;
  count = 0;
  lastKey: any = null;
  PAGE_SIZE = 10;

  IMAGES = IMAGES;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authStateService: AuthStateService
  ) {}

  ngOnInit() {
    if (!this.authStateService.isAuthenticated()) {
      this.toastr.error('Vui lòng đăng nhập để xem thông báo!');
      return;
    }
    this.listenCount();
    this.loadNotifications();
  }

  get currentUserId(): string | null {
    const user = this.authStateService.getCurrentUser();
    return user?.id ? String(user.id) : null; // Chuyển id thành chuỗi
  }

  get pageCount(): number {
    return Math.ceil(this.count / this.PAGE_SIZE);
  }

  // Hàm kiểm tra và trả về URL hình ảnh hợp lệ
  getValidImageUrl(imageUrl: string | undefined | null): string {
    // Nếu không có URL hoặc URL rỗng, trả về hình mặc định
    if (!imageUrl) {
      return this.IMAGES.imageDefault;
    }

    // Kiểm tra nếu URL bắt đầu bằng Google redirect
    if (imageUrl.startsWith('https://www.google.com/url')) {
      return this.IMAGES.imageDefault;
    }

    // Kiểm tra định dạng hình ảnh (jpg, jpeg, png, gif, webp)
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
    if (!imageExtensions.test(imageUrl)) {
      return this.IMAGES.imageDefault;
    }

    // Nếu URL hợp lệ, trả về chính nó
    return imageUrl;
  }

  listenCount() {
    if (!this.currentUserId) return;
    const notiRef = collection(db, 'users', this.currentUserId, 'notifications');
    const q = query(notiRef, where('is_deleted', '==', false));

    onSnapshot(q, (snapshot) => {
      this.count = snapshot.size;
    }, (error) => {
      console.error('Lỗi khi nghe số lượng thông báo:', error);
      this.toastr.error('Không thể tải số lượng thông báo!');
    });
  }

  loadNotifications() {
    if (!this.currentUserId) return;
    this.isLoading = true;

    const notiRef = collection(db, 'users', this.currentUserId, 'notifications');
    const first = query(notiRef, where('is_deleted', '==', false), orderBy('time', 'desc'), limit(this.PAGE_SIZE));

    onSnapshot(first, (snapshot) => {
      const notiList: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data['time'] && data['time'].toDate) {
          data['time'] = data['time'].toDate();
        }
        notiList.push({ ...data, key: doc.id });
      });
      this.notifications = notiList;
      console.log(this.notifications);
      this.lastKey = snapshot.docs[snapshot.docs.length - 1];
      this.isLoading = false;
    }, (error) => {
      console.error('Lỗi khi tải thông báo:', error);
      this.toastr.error('Không thể tải danh sách thông báo!');
      this.isLoading = false;
    });
  }

  async loadMore() {
    if (!this.currentUserId || !this.lastKey) return;
    this.isLoading = true;

    try {
      const notiRef = collection(db, 'users', this.currentUserId, 'notifications');
      const nextQuery = query(notiRef, where('is_deleted', '==', false), orderBy('time', 'desc'), startAfter(this.lastKey), limit(this.PAGE_SIZE));
      const snapshot = await getDocs(nextQuery);

      const nextList: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data['time'] && data['time'].toDate) {
          data['time'] = data['time'].toDate();
        }
        nextList.push({ ...data, key: doc.id });
      });

      this.notifications = [...this.notifications, ...nextList];
      this.lastKey = snapshot.docs[snapshot.docs.length - 1];
    } catch (error) {
      console.error('Lỗi khi tải thêm thông báo:', error);
      this.toastr.error('Không thể tải thêm thông báo!');
    } finally {
      this.isLoading = false;
    }
  }

  async markAllRead() {
    if (!this.currentUserId) return;

    try {
      const notiRef = collection(db, 'users', this.currentUserId, 'notifications');
      const readQuery = query(notiRef, where('is_read', '==', false));
      const snapshot = await getDocs(readQuery);

      const batch = writeBatch(db);
      snapshot.forEach((doc) => {
        batch.update(doc.ref, { is_read: true });
      });
      await batch.commit();
      this.toastr.success('Đã đánh dấu tất cả thông báo là đã đọc!');
    } catch (error) {
      console.error('Lỗi khi đánh dấu tất cả đã đọc:', error);
      this.toastr.error('Không thể đánh dấu tất cả thông báo là đã đọc!');
    }
  }

  async removeAllNotifications() {
    if (!this.currentUserId) return;

    try {
      const notiRef = collection(db, 'users', this.currentUserId, 'notifications');
      const deleteQuery = query(notiRef, where('is_deleted', '==', false));
      const snapshot = await getDocs(deleteQuery);

      const batch = writeBatch(db);
      snapshot.forEach((doc) => {
        batch.update(doc.ref, { is_deleted: true });
      });
      await batch.commit();
      this.notifications = [];
      this.toastr.success('Đã xóa tất cả thông báo!');
    } catch (error) {
      console.error('Lỗi khi xóa tất cả thông báo:', error);
      this.toastr.error('Không thể xóa tất cả thông báo!');
    }
  }

  async removeNotification(key: string) {
    if (!this.currentUserId) return;

    try {
      await updateDoc(doc(db, 'users', this.currentUserId, 'notifications', key), { is_deleted: true });
      this.notifications = this.notifications.filter(n => n.key !== key);
      this.toastr.success('Đã xóa thông báo!');
    } catch (error) {
      console.error('Lỗi khi xóa thông báo:', error);
      this.toastr.error('Không thể xóa thông báo!');
    }
  }

  async markRead(key: string) {
    if (!this.currentUserId) return;

    try {
      await updateDoc(doc(db, 'users', this.currentUserId, 'notifications', key), { is_read: true });
    } catch (error) {
      console.error('Lỗi khi đánh dấu thông báo đã đọc:', error);
      this.toastr.error('Không thể đánh dấu thông báo là đã đọc!');
    }
  }

  handleClick(item: any) {
    if (!item?.key) {
      this.toastr.error('Thông báo không hợp lệ!');
      return;
    }
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
      default:
        this.toastr.warning('Loại thông báo không được hỗ trợ!');
        break;
    }
  }
}

import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { AuthStateService } from '../../../../_services/auth-state.service';
import { FirebaseService } from '../../../../_services/firebase.service';
import { ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-left-side-bar',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InfiniteScrollDirective
  ],
  templateUrl: './left-side-bar.component.html',
  styleUrl: './left-side-bar.component.css'
})
export class LeftSideBarComponent {
  @Input() isEmployer: boolean = false;

  rooms: any[] = [];
  searchText = '';
  hasMore = true;
  loading = false;
  lastDoc: any = null;
  page = 0;
  count = 0;
  private readonly pageSize = 20;
  private searchSubject = new Subject<string>();
  private unsubscribeSnapshot: any;

  currentUser: any;

  constructor(
    private firebaseService: FirebaseService,
    private authStateService: AuthStateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authStateService.getCurrentUser();

    this.searchSubject.pipe(debounceTime(500)).subscribe((text) => {
      this.searchText = text;
      this.listenRooms();
    });

    this.listenRooms();
  }

  ngOnDestroy() {
    if (this.unsubscribeSnapshot) this.unsubscribeSnapshot();
  }

  listenRooms() {
    if (!this.currentUser) return;
    if (this.unsubscribeSnapshot) this.unsubscribeSnapshot();

    this.loading = true;
    this.page = 0;

    this.unsubscribeSnapshot = this.firebaseService.listenChatRooms(
      this.currentUser.userId,
      this.pageSize,
      this.searchText,
      (chatRooms: any[], lastDoc: any, count: number) => {
        this.rooms = chatRooms;
        this.lastDoc = lastDoc;
        this.count = count;
        this.hasMore = true;
        this.page = 1;
        this.loading = false;
      }
    );
  }

  loadMore() {
    if (!this.hasMore || !this.currentUser) return;

    if (Math.ceil(this.count / this.pageSize) <= this.page) {
      this.hasMore = false;
      return;
    }

    this.firebaseService.getMoreChatRooms(
      this.currentUser.userId,
      this.lastDoc,
      this.pageSize,
      this.searchText
    ).then((result: any) => {
      this.rooms = [...this.rooms, ...result.chatRooms];
      this.lastDoc = result.lastDoc;
      this.page += 1;
    });
  }

  handleSearch(event: any) {
    this.searchSubject.next(event.target.value);
  }

  navigateToRoom(roomId: string) {
    this.router.navigate(['/chat', roomId]);
  }
}

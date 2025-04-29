import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private USER_KEY = 'current_user';
  private authSubject = new BehaviorSubject<boolean>(this.hasUser());

  constructor() {}

  private hasUser(): boolean {
    const userJson = localStorage.getItem(this.USER_KEY);
    return !!userJson;
  }

  getAuthStatus() {
    return this.authSubject.asObservable();
  }

  getCurrentUser(): any {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  setCurrentUser(user: any) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.authSubject.next(true); // Cập nhật trạng thái login
  }

  clearUser() {
    localStorage.removeItem(this.USER_KEY);
    this.authSubject.next(false); // Cập nhật trạng thái logout
  }

  isAuthenticated(): boolean {
    return this.hasUser();
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AUTH_CONFIG } from '../_configs/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private baseUrl = `${environment.apiUrl}/api/auth`;

  constructor(private http: HttpClient) { }

  getToken(email: string, password: string, role_name: string): Observable<any> {
    const url = `${this.baseUrl}/token/`;

    const data = {
      grant_type: AUTH_CONFIG.PASSWORD_KEY,
      client_id: AUTH_CONFIG.CLIENT_ID,
      client_secret: AUTH_CONFIG.CLIENT_SECRET,
      username: email,
      password: password,
      role_name: role_name,
    };

    return this.http.post(url, data);
  }

  convertToken(provider: string, code: string): Observable<any> {
    const url = `${this.baseUrl}/convert-token/`;

    const data = {
      grant_type: AUTH_CONFIG.CONVERT_TOKEN_KEY,
      client_id: AUTH_CONFIG.CLIENT_ID,
      client_secret: AUTH_CONFIG.CLIENT_SECRET,
      backend: provider,
      token: code,
    };

    return this.http.post(url, data);
  }

  revokeToken(accessToken: string, backend: string): Observable<any> {
    const url = `${this.baseUrl}/revoke-token/`;

    const data = {
      client_id: AUTH_CONFIG.CLIENT_ID,
      client_secret: AUTH_CONFIG.CLIENT_SECRET,
      token: accessToken,
      backend: backend
    };

    return this.http.post(url, data);
  }

  checkCreds(email: string, roleName: string): Observable<any> {
    const url = `${this.baseUrl}/check-creds/`;

    const data = { email, roleName };

    return this.http.post(url, data);
  }

  jobSeekerRegister(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/job-seeker/register/`, data);
  }

  employerRegister(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/employer/register/`, data);
  }

  getUserInfo(): Observable<any> {
    return this.http.get(`${this.baseUrl}/user-info/`);
  }

  updateUser(data: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/update-user/`, data);
  }

  updateAvatar(data: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/avatar/`, data);
  }

  deleteAvatar(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/avatar/`);
  }

  changePassword(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/change-password/`, data);
  }

  forgotPassword(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password/`, data);
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password/`, data);
  }

  getUserSettings(): Observable<any> {
    return this.http.get(`${this.baseUrl}/settings/`);
  }

  updateUserSettings(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/settings/`, data);
  }
}

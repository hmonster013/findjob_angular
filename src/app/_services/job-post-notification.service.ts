import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobPostNotificationService {

  private baseUrl = `${environment.apiUrl}/api/job/web/job-post-notifications/`;

  constructor(private http: HttpClient) {}

  addJobPostNotification(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  getJobPostNotifications(params: any = {}): Observable<any> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this.http.get(this.baseUrl, { params: httpParams });
  }

  getJobPostNotificationDetailById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}${id}/`);
  }

  updateJobPostNotificationById(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}${id}/`, data);
  }

  deleteJobPostNotificationDetailById(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}${id}/`);
  }

  active(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}${id}/active/`, {});
  }
}

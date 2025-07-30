import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobPostActivityService {

  private baseUrl = `${environment.apiUrl}/api/job/web`;

  constructor(private http: HttpClient) {}

  // ✅ Job seeker APIs
  applyJob(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/job-seeker-job-posts-activity/`, data);
  }

  getJobPostActivity(params: any = {}): Observable<any> {
    return this.http.get(`${this.baseUrl}/job-seeker-job-posts-activity/`, {
      params: this.convertToHttpParams(params),
    });
  }

  getJobPostChatActivity(params: any = {}): Observable<any> {
    return this.http.get(`${this.baseUrl}/job-seeker-job-posts-activity/chat/`, {
      params: this.convertToHttpParams(params),
    });
  }

  sendEmail(id: number, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/employer-job-posts-activity/${id}/send-email/`, data);
  }

  getAppliedResume(params: any = {}): Observable<any> {
    return this.http.get(`${this.baseUrl}/employer-job-posts-activity/`, {
      params: this.convertToHttpParams(params),
    });
  }

  getAppliedResumeChat(params: any = {}): Observable<any> {
    return this.http.get(`${this.baseUrl}/employer-job-posts-activity/chat/`, {
      params: this.convertToHttpParams(params),
    });
  }

  changeApplicationStatus(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/employer-job-posts-activity/${id}/application-status/`, data);
  }

  deleteJobPostActivity(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/employer-job-posts-activity/${id}/`);
  }

  private convertToHttpParams(params: any): HttpParams {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return httpParams;
  }
}

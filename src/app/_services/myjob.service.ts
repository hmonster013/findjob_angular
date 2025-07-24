import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FindjobService {

  private baseUrl = `${environment.apiUrl}/api/findjob/web`;

  constructor(private http: HttpClient) {}

  getFeedbacks(): Observable<any> {
    return this.http.get(`${this.baseUrl}/feedbacks/`);
  }

  createFeedback(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/feedbacks/`, data);
  }

  sendSMSDownloadApp(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/sms-download-app/`, data);
  }

  getBanners(params: any = {}): Observable<any> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this.http.get(`${this.baseUrl}/banner/`, { params: httpParams });
  }
}

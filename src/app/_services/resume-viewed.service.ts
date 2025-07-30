import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResumeViewedService {

  private baseUrl = `${environment.apiUrl}/api/info/web/resume-views/`;

  constructor(private http: HttpClient) {}

  getResumeViewed(params: any = {}): Observable<any> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        httpParams = httpParams.set(key, params[key]);
      }
    }

    return this.http.get(this.baseUrl, { params: httpParams });
  }
}

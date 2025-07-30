import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResumeSavedService {

  private baseUrl = `${environment.apiUrl}/api/info/web/resumes-saved`;

  constructor(private http: HttpClient) {}

  getResumesSaved(params: any = {}): Observable<any> {
    return this.http.get(`${this.baseUrl}/`, {
      params: this.toHttpParams(params)
    });
  }

  exportResumesSaved(params: any = {}): Observable<any> {
    return this.http.get(`${this.baseUrl}/export/`, {
      params: this.toHttpParams(params)
    });
  }

  // Helper to convert JS object to HttpParams
  private toHttpParams(params: any): HttpParams {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return httpParams;
  }
}

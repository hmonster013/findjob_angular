import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EducationDetailService {

  private baseUrl = `${environment.apiUrl}/api/info/web/educations-detail/`;

  constructor(private http: HttpClient) {}

  addEducationsDetail(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  getEducationDetailById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}${id}/`);
  }

  updateEducationDetailById(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}${id}/`, data);
  }

  deleteEducationDetailById(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}${id}/`);
  }
}

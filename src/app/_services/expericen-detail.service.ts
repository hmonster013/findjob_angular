import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExperienceDetailService {

  private baseUrl = `${environment.apiUrl}/api/info/web/experiences-detail/`;

  constructor(private http: HttpClient) {}

  addExperienceDetail(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  getExperienceDetailById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}${id}/`);
  }

  updateExperienceDetailById(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}${id}/`, data);
  }

  deleteExperienceDetailById(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}${id}/`);
  }
}

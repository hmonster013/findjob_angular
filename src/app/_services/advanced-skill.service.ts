import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdvancedSkillService {
  private baseUrl = `${environment.apiUrl}/api/info/web/advanced-skills/`;

  constructor(private http: HttpClient) { }

  addAdvancedSkills(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  getAdvancedSkillById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}${id}/`);
  }

  updateAdvancedSkillById(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}${id}/`, data);
  }

  deleteAdvancedSkillById(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}${id}/`);
  }
}

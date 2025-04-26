import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LanguageSkillService {

  private baseUrl = `${environment.apiUrl}/api/info/web/language-skills/`;

  constructor(private http: HttpClient) {}

  addLanguageSkills(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  getLanguageSkillById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}${id}/`);
  }

  updateLanguageSkillById(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}${id}/`, data);
  }

  deleteLanguageSkillById(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}${id}/`);
  }
}

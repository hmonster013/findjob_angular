import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyImageService {

  private baseUrl = `${environment.apiUrl}/api/info/web/company-images/`;

  constructor(private http: HttpClient) {}

  getCompanyImages(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  addCompanyImage(data: FormData): Observable<any> {
    return this.http.post(this.baseUrl, data);
    // ⛔ Không cần set headers 'Content-Type': Angular sẽ tự set cho FormData
  }

  deleteCompanyImage(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}${id}/`);
  }
}

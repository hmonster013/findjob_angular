import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private baseUrl = `${environment.apiUrl}/api/info/web`;

  constructor(private http: HttpClient) {}

  getCompany(): Observable<any> {
    return this.http.get(`${this.baseUrl}/company/`);
  }

  updateCompany(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/private-companies/${id}/`, data);
  }

  updateCompanyImageUrl(data: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/private-companies/company-image-url/`, data);
  }

  updateCompanyCoverImageUrl(data: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/private-companies/company-cover-image-url/`, data);
  }

  getCompanies(params: any = {}): Observable<any> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this.http.get(`${this.baseUrl}/companies/`, { params: httpParams });
  }

  getCompanyDetailById(slug: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/companies/${slug}/`);
  }

  followCompany(slug: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/companies/${slug}/followed/`, {});
  }

  getTopCompanies(): Observable<any> {
    return this.http.get(`${this.baseUrl}/companies/top/`);
  }
}

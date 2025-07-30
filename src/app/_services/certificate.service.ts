import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  private baseUrl = `${environment.apiUrl}/api/info/web/certificates-detail/`;

  constructor(private http: HttpClient) {}

  addCertificates(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  getCertificateById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}${id}/`);
  }

  updateCertificateById(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}${id}/`, data);
  }

  deleteCertificateById(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}${id}/`);
  }
}

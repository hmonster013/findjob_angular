import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private baseUrl = `${environment.apiUrl}/api/common`;

  constructor(private http: HttpClient) {}

  getConfigs(): Observable<any> {
    return this.http.get(`${this.baseUrl}/configs/`);
  }

  getDistrictsByCityId(cityId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/districts/?cityId=${cityId}`);
  }

  getTop10Careers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/top-careers/`);
  }
}

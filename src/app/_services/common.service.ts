import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ObservableLike } from 'rxjs';
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

  getCities(): Observable<any> {
    return this.http.get(`${this.baseUrl}/cities/`);
  }

  getDistrictsByCityId(cityId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/districts/?cityId=${cityId}`);
  }

  getCareers(noPagination: boolean = false): Observable<any> {
    const params = new HttpParams().set('noPagination', noPagination.toString());
    return this.http.get(`${this.baseUrl}/all-careers/`, { params });
  }

  getTop10Careers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/top-careers/`);
  }
}

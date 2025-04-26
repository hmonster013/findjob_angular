import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyFollowedService {

  private baseUrl = `${environment.apiUrl}/api/info/web/companies-follow/`;

  constructor(private http: HttpClient) {}

  getCompaniesFollowed(params: any = {}): Observable<any> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        httpParams = httpParams.set(key, params[key]);
      }
    }

    return this.http.get(this.baseUrl, { params: httpParams });
  }
}

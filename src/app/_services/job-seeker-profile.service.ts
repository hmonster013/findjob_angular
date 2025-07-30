import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobSeekerProfileService {

  private baseUrl = `${environment.apiUrl}/api/info`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/profile/`);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/profile/`, data);
  }

  getResumes(jobSeekerProfileId: number, params: any = {}): Observable<any> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        httpParams = httpParams.set(key, params[key]);
      }
    }

    return this.http.get(`${this.baseUrl}/web/job-seeker-profiles/${jobSeekerProfileId}/resumes/`, {
      params: httpParams
    });
  }
}

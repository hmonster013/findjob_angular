import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  private baseUrl = `${environment.apiUrl}/api/job/web/statistics`;

  constructor(private http: HttpClient) {}

  employerGeneralStatistics(): Observable<any> {
    return this.http.get(`${this.baseUrl}/employer-general-statistics/`);
  }

  employerRecruitmentStatisticsByRank(data: any = {}): Observable<any> {
    return this.http.post(`${this.baseUrl}/employer-recruitment-statistics-by-rank/`, data);
  }

  employerApplicationStatistics(data: any = {}): Observable<any> {
    return this.http.post(`${this.baseUrl}/employer-application-statistics/`, data);
  }

  employerCandidateStatistics(data: any = {}): Observable<any> {
    return this.http.post(`${this.baseUrl}/employer-candidate-statistics/`, data);
  }

  employerRecruitmentStatistics(data: any = {}): Observable<any> {
    return this.http.post(`${this.baseUrl}/employer-recruitment-statistics/`, data);
  }

  jobSeekerGeneralStatistics(): Observable<any> {
    return this.http.get(`${this.baseUrl}/job-seeker-general-statistics/`);
  }

  jobSeekerTotalView(): Observable<any> {
    return this.http.get(`${this.baseUrl}/job-seeker-total-view/`);
  }

  jobSeekerActivityStatistics(): Observable<any> {
    return this.http.get(`${this.baseUrl}/job-seeker-activity-statistics/`);
  }
}

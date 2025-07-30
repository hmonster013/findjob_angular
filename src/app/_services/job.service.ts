import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  private baseUrl = `${environment.apiUrl}/api/job/web`;

  constructor(private http: HttpClient) {}

  searchJobSuggestTitle(keyword: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/seach/job-suggest-title/`, {
      params: new HttpParams().set('q', keyword)
    });
  }

  getEmployerJobPost(params: any = {}): Observable<any> {
    return this.http.get(`${this.baseUrl}/private-job-posts/`, {
      params: this.toHttpParams(params)
    });
  }

  exportEmployerJobPosts(params: any = {}): Observable<any> {
    return this.http.get(`${this.baseUrl}/private-job-posts/export/`, {
      params: this.toHttpParams(params)
    });
  }

  getEmployerJobPostDetailById(slug: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/private-job-posts/${slug}/`);
  }

  addJobPost(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/private-job-posts/`, data);
  }

  updateJobPostById(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/private-job-posts/${id}/`, data);
  }

  deleteJobPostById(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/private-job-posts/${id}/`);
  }

  getJobPostOptions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/private-job-posts/job-posts-options/`);
  }

  // ✅ Public job posts
  getJobPosts(params: any = {}): Observable<any> {
    return this.http.get(`${this.baseUrl}/job-posts/`, {
      params: this.toHttpParams(params)
    });
  }

  getJobPostDetailById(slug: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/job-posts/${slug}/`);
  }

  getSuggestedJobPosts(params: any = {}): Observable<any> {
    return this.http.get(`${this.baseUrl}/private-job-posts/suggested-job-posts/`, {
      params: this.toHttpParams(params)
    });
  }

  getJobPostsSaved(params: any = {}): Observable<any> {
    return this.http.get(`${this.baseUrl}/job-posts/job-posts-saved/`, {
      params: this.toHttpParams(params)
    });
  }

  saveJobPost(slug: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/job-posts/${slug}/job-saved/`, {});
  }

  private toHttpParams(params: any): HttpParams {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return httpParams;
  }
}

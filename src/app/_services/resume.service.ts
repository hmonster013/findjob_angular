import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  private baseUrl = `${environment.apiUrl}/api/info/web`;
  private privateBaseUrl = `${environment.apiUrl}/api/info/web/private-resumes`;

  constructor(private http: HttpClient) {}

  // ✅ Public Resumes
  sendEmail(slug: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/resumes/${slug}/send-email/`, data);
  }

  getResumes(params: any = {}): Observable<any> {
    return this.http.get(`${this.baseUrl}/resumes/`, { params });
  }

  getResumeDetail(resumeSlug: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/resumes/${resumeSlug}/`);
  }

  saveResume(slug: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/resumes/${slug}/resume-saved/`, {});
  }

  viewResume(slug: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/resumes/${slug}/view-resume/`, {});
  }

  // ✅ Private Resumes
  getResumeOwner(resumeSlug: string): Observable<any> {
    return this.http.get(`${this.privateBaseUrl}/${resumeSlug}/resume-owner/`);
  }

  getCv(resumeSlug: string): Observable<any> {
    return this.http.get(`${this.privateBaseUrl}/${resumeSlug}/cv/`);
  }

  updateCV(resumeSlug: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.privateBaseUrl}/${resumeSlug}/cv/`, formData);
  }

  addResume(formData: FormData): Observable<any> {
    return this.http.post(this.privateBaseUrl + '/', formData);
  }

  updateResume(resumeSlug: string, data: any): Observable<any> {
    return this.http.put(`${this.privateBaseUrl}/${resumeSlug}/`, data);
  }

  deleteResume(resumeSlug: string): Observable<any> {
    return this.http.delete(`${this.privateBaseUrl}/${resumeSlug}/`);
  }

  activeResume(resumeSlug: string): Observable<any> {
    return this.http.get(`${this.privateBaseUrl}/${resumeSlug}/resume-active/`);
  }

  getExperiencesDetail(resumeSlug: string): Observable<any> {
    return this.http.get(`${this.privateBaseUrl}/${resumeSlug}/experiences-detail/`);
  }

  getEducationsDetail(resumeSlug: string): Observable<any> {
    return this.http.get(`${this.privateBaseUrl}/${resumeSlug}/educations-detail/`);
  }

  getCertificates(resumeSlug: string): Observable<any> {
    return this.http.get(`${this.privateBaseUrl}/${resumeSlug}/certificates-detail/`);
  }

  getLanguageSkills(resumeSlug: string): Observable<any> {
    return this.http.get(`${this.privateBaseUrl}/${resumeSlug}/language-skills/`);
  }

  getAdvancedSkills(resumeSlug: string): Observable<any> {
    return this.http.get(`${this.privateBaseUrl}/${resumeSlug}/advanced-skills/`);
  }
}

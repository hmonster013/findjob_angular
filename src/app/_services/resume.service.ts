import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  private baseUrl = `${environment.apiUrl}/api/info/web`;

  constructor(private http: HttpClient) {}

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

  getResumeOwner(resumeSlug: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/private-resumes/${resumeSlug}/resume-owner/`);
  }

  getCv(resumeSlug: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/private-resumes/${resumeSlug}/cv/`);
  }

  updateCV(resumeSlug: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/private-resumes/${resumeSlug}/cv/`, formData);
  }

  addResume(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/private-resumes/`, formData);
  }

  updateResume(resumeSlug: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/private-resumes/${resumeSlug}/`, data);
  }

  deleteResume(resumeSlug: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/private-resumes/${resumeSlug}/`);
  }

  activeResume(resumeSlug: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/private-resumes/${resumeSlug}/resume-active/`);
  }

  getExperiencesDetail(resumeSlug: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/private-resumes/${resumeSlug}/experiences-detail/`);
  }

  getEducationsDetail(resumeSlug: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/private-resumes/${resumeSlug}/educations-detail/`);
  }

  getCertificates(resumeSlug: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/private-resumes/${resumeSlug}/certificates-detail/`);
  }

  getLanguageSkills(resumeSlug: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/private-resumes/${resumeSlug}/language-skills/`);
  }

  getAdvancedSkills(resumeSlug: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/private-resumes/${resumeSlug}/advanced-skills/`);
  }
}

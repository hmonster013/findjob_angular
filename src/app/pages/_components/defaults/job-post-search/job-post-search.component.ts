import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-post-search',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './job-post-search.component.html',
  styleUrl: './job-post-search.component.css'
})
export class JobPostSearchComponent {
  form: FormGroup;
  showAdvanceFilter = false;

  careerOptions: { id: number, name: string }[] = [];
  cityOptions: { id: number, name: string }[] = [];
  positionOptions: { id: number, name: string }[] = [];
  experienceOptions: { id: number, name: string }[] = [];
  jobTypeOptions: { id: number, name: string }[] = [];
  typeOfWorkplaceOptions: { id: number, name: string }[] = [];
  genderOptions: { id: number, name: string }[] = [];

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      kw: [''],
      careerId: [''],
      cityId: [''],
      positionId: [''],
      experienceId: [''],
      jobTypeId: [''],
      typeOfWorkplaceId: [''],
      genderId: ['']
    });
  }

  handleSaveKeywordLocalStorage(kw: string) {
    try {
      if (kw) {
        const keywordListStr = localStorage.getItem('myjob_search_history');
        let keywordList = keywordListStr ? JSON.parse(keywordListStr) : [];

        if (!keywordList.includes(kw)) {
          if (keywordList.length >= 5) {
            keywordList = [kw, ...keywordList.slice(0, 4)];
          } else {
            keywordList = [kw, ...keywordList];
          }
          localStorage.setItem('myjob_search_history', JSON.stringify(keywordList));
        }
      }
    } catch (error) {
      console.error('Lỗi khi lưu từ khóa:', error);
    }
  }

  onSubmit() {
    const data = this.form.value;
    this.handleSaveKeywordLocalStorage(data.kw);
    this.router.navigate(['/viec-lam'], { queryParams: data });
  }

  onReset() {
    this.form.reset();
  }

  toggleAdvanceFilter() {
    this.showAdvanceFilter = !this.showAdvanceFilter;
  }
}

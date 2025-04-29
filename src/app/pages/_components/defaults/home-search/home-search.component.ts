import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-search',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './home-search.component.html',
  styleUrl: './home-search.component.css'
})
export class HomeSearchComponent {
  form: FormGroup;

  careerOptions = [
    { id: 1, name: 'Công nghệ thông tin' },
    { id: 2, name: 'Kế toán' },
    { id: 3, name: 'Marketing' },
    // 🔥 sau này bạn load từ ConfigService nhé
  ];

  cityOptions = [
    { id: 1, name: 'Hồ Chí Minh' },
    { id: 2, name: 'Hà Nội' },
    { id: 3, name: 'Đà Nẵng' },
    // 🔥 sau này bạn load từ ConfigService nhé
  ];

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      kw: [''],
      careerId: [''],
      cityId: [''],
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
}

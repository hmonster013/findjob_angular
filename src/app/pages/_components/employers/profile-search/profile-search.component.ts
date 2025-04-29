import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-search',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './profile-search.component.html',
  styleUrl: './profile-search.component.css'
})
export class ProfileSearchComponent {
  @Output() search = new EventEmitter<any>();
  @Output() reset = new EventEmitter<void>();

  searchForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      keyword: [''],
      city: [''],
      career: [''],
      experience: [''],
      position: [''],
      academicLevel: [''],
      workplace: [''],
      jobType: [''],
      gender: [''],
      maritalStatus: [''],
    });
  }

  onSubmit() {
    this.search.emit(this.searchForm.value);
  }

  onReset() {
    this.searchForm.reset();
    this.reset.emit();
  }
}

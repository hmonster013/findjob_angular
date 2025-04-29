import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-saved-resume-filter-form',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './saved-resume-filter-form.component.html',
  styleUrl: './saved-resume-filter-form.component.css'
})
export class SavedResumeFilterFormComponent {
  @Input() allConfig: any = {};
  @Output() handleFilter = new EventEmitter<any>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      kw: [''],
      salaryMax: [''],
      experienceId: [''],
      cityId: ['']
    });
  }

  onSubmit() {
    this.handleFilter.emit(this.form.value);
  }

  onReset() {
    this.form.reset();
    this.handleFilter.emit(this.form.value);
  }
}

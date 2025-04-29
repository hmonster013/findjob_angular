import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-education-detail-form',
  standalone: true,
  templateUrl: './education-detail-form.component.html',
  styleUrls: ['./education-detail-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class EducationDetailFormComponent implements OnInit, OnChanges {
  @Input() editData: any = null;
  @Input() handleAddOrUpdate!: (data: any) => void;

  form!: FormGroup;
  maxYesterday: string = '';
  maxToday: string = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      degreeName: ['', [Validators.required, Validators.maxLength(200)]],
      major: ['', [Validators.required, Validators.maxLength(255)]],
      trainingPlaceName: ['', [Validators.required, Validators.maxLength(255)]],
      startDate: ['', [Validators.required]],
      completedDate: [''],
      description: ['']
    });

    this.setDateLimits();

    if (this.editData) {
      this.form.patchValue(this.editData);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['editData'] && !changes['editData'].firstChange) {
      if (this.editData) {
        this.form.patchValue(this.editData);
      } else {
        this.form.reset();
      }
    }
  }

  setDateLimits() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    this.maxToday = today.toISOString().split('T')[0];
    this.maxYesterday = yesterday.toISOString().split('T')[0];
  }

  onSubmit() {
    if (this.form.valid && this.handleAddOrUpdate) {
      this.handleAddOrUpdate(this.form.value);
    }
  }
}

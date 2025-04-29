import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-certificate-form',
  standalone: true,
  templateUrl: './certificate-form.component.html',
  styleUrls: ['./certificate-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class CertificateFormComponent implements OnInit, OnChanges {
  @Input() editData: any = null;
  @Input() serverErrors: any = null;
  @Input() handleAddOrUpdate!: (data: any) => void;

  form!: FormGroup;

  maxYesterday: string = '';
  maxToday: string = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      trainingPlace: ['', [Validators.required, Validators.maxLength(255)]],
      startDate: ['', [Validators.required]],
      expirationDate: [''],
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

    if (changes['serverErrors'] && this.serverErrors) {
      for (const field in this.serverErrors) {
        if (this.form.controls[field]) {
          this.form.controls[field].setErrors({
            serverError: this.serverErrors[field]?.join(' ')
          });
        }
      }
    }
  }

  setDateLimits() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    this.maxToday = today.toISOString().split('T')[0];       // 'YYYY-MM-DD'
    this.maxYesterday = yesterday.toISOString().split('T')[0];
  }

  onSubmit() {
    if (this.form.valid && this.handleAddOrUpdate) {
      this.handleAddOrUpdate(this.form.value);
    }
  }
}

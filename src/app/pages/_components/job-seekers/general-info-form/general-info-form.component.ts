import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-general-info-form',
  standalone: true,
  templateUrl: './general-info-form.component.html',
  styleUrls: ['./general-info-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class GeneralInfoFormComponent implements OnInit, OnChanges {
  @Input() editData: any = null;
  @Input() handleUpdate!: (data: any) => void;
  @Input() allConfig: any = {};
  @Output() cancelForm = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      position: ['', Validators.required],
      academicLevel: ['', Validators.required],
      experience: ['', Validators.required],
      career: ['', Validators.required],
      city: ['', Validators.required],
      salaryMin: ['', [Validators.required, Validators.min(0)]],
      salaryMax: ['', [Validators.required, Validators.min(0)]],
      typeOfWorkplace: ['', Validators.required],
      jobType: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(800)]],
    });

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

  onSubmit() {
    if (this.form.valid && this.handleUpdate) {
      this.handleUpdate(this.form.value);
    }
  }

  cancel() {
    this.form.reset();
    this.cancelForm.emit();
  }
}

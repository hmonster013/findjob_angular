import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-post-notification-form',
  standalone: true,
  templateUrl: './job-post-notification-form.component.html',
  styleUrls: ['./job-post-notification-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class JobPostNotificationFormComponent implements OnInit, OnChanges {
  @Input() editData: any = null;
  @Input() handleAddOrUpdate!: (data: any) => void;
  @Input() allConfig: any = {};

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      jobName: ['', [Validators.required, Validators.maxLength(200)]],
      career: ['', Validators.required],
      city: ['', Validators.required],
      position: [''],
      experience: [''],
      salary: [''],
      frequency: [
        (this.allConfig?.frequencyNotificationOptions || [])[0]?.id || null,
      ],
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
    if (this.form.valid && this.handleAddOrUpdate) {
      this.handleAddOrUpdate(this.form.value);
    }
  }
}

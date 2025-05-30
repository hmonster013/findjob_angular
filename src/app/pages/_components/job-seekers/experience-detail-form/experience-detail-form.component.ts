import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-experience-detail-form',
  standalone: true,
  templateUrl: './experience-detail-form.component.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class ExperienceDetailFormComponent implements OnInit, OnChanges {
  @Input() editData: any = null;
  @Input() handleAddOrUpdate!: (data: any) => void;
  @Input() resumeSlug: string | null = null;
  @Output() cancelForm = new EventEmitter<void>();

  form!: FormGroup;
  maxYesterday: string = '';
  maxToday: string = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      id: [null],
      jobName: ['', [Validators.required, Validators.maxLength(200)]],
      companyName: ['', [Validators.required, Validators.maxLength(255)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: ['', Validators.maxLength(1000)],
    }, { validators: this.dateValidator });

    this.setDateLimits();
    if (this.editData) {
      this.patchFormData(this.editData);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['editData'] && !changes['editData'].firstChange) {
      if (this.editData) {
        this.patchFormData(this.editData);
      } else {
        this.form.reset();
      }
    }
  }

  patchFormData(data: any) {
    const startDate = data?.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '';
    const endDate = data?.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '';
    this.form.patchValue({
      id: data?.id || null,
      jobName: data?.jobName || '',
      companyName: data?.companyName || '',
      startDate: startDate,
      endDate: endDate,
      description: data?.description || '',
    });
  }

  setDateLimits() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    this.maxToday = today.toISOString().split('T')[0];
    this.maxYesterday = yesterday.toISOString().split('T')[0];
  }

  dateValidator(form: FormGroup) {
    const startDate = form.get('startDate')?.value;
    const endDate = form.get('endDate')?.value;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      form.get('endDate')?.setErrors({ invalidRange: true });
      return { invalidDateRange: true };
    }

    return null;
  }

  onSubmit() {
    if (this.form.valid && this.handleAddOrUpdate) {
      this.handleAddOrUpdate(this.form.value);
    }
  }

  cancel() {
    this.form.reset();
    this.cancelForm.emit();
  }
}

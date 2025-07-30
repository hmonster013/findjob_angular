import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-education-detail-form',
  standalone: true,
  templateUrl: './education-detail-form.component.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class EducationDetailFormComponent implements OnInit, OnChanges {
  @Input() editData: any = null;
  @Input() handleAddOrUpdate!: (data: any, id?: number) => void;
  @Input() resumeSlug: string | null = null;
  @Output() cancelForm = new EventEmitter<void>();

  form!: FormGroup;
  maxYesterday: string = '';
  maxToday: string = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      degreeName: ['', [Validators.required, Validators.maxLength(200)]],
      major: ['', [Validators.required, Validators.maxLength(255)]],
      trainingPlaceName: ['', [Validators.required, Validators.maxLength(255)]],
      startDate: ['', Validators.required],
      completedDate: [null],
      isCurrent: [false],
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
        this.form.reset({ isCurrent: false, completedDate: null });
      }
    }
  }

  patchFormData(data: any) {
    const startDate = data?.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '';
    const completedDate = data?.completedDate ? new Date(data.completedDate).toISOString().split('T')[0] : null;
    this.form.patchValue({
      degreeName: data?.degreeName || '',
      major: data?.major || '',
      trainingPlaceName: data?.trainingPlaceName || '',
      startDate: startDate,
      completedDate: completedDate,
      isCurrent: !data?.completedDate, // Đang học nếu completedDate là null
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
    const completedDate = form.get('completedDate')?.value;

    if (startDate && completedDate && new Date(startDate) > new Date(completedDate)) {
      form.get('completedDate')?.setErrors({ invalidRange: true });
      return { invalidDateRange: true };
    }

    return null;
  }

  onIsCurrentChange(event: Event) {
    const isCurrent = (event.target as HTMLInputElement).checked;
    if (isCurrent) {
      this.form.get('completedDate')?.setValue(null);
      this.form.get('completedDate')?.clearValidators();
    } else {
      this.form.get('completedDate')?.setValidators(Validators.required);
    }
    this.form.get('completedDate')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.form.valid && this.handleAddOrUpdate) {
      const id = this.editData?.id;
      const payload = {
        ...this.form.value,
        completedDate: this.form.value.isCurrent ? null : this.form.value.completedDate,
      };
      // Loại bỏ isCurrent khỏi payload
      delete payload.isCurrent;
      this.handleAddOrUpdate(payload, id);
    }
  }

  cancel() {
    this.form.reset({ isCurrent: false, completedDate: null });
    this.cancelForm.emit();
  }
}

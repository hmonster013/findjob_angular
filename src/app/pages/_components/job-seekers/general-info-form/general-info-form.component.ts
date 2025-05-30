import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-general-info-form',
  standalone: true,
  templateUrl: './general-info-form.component.html',
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
    }, { validators: this.salaryValidator });

    if (this.editData) {
      this.patchFormData(this.editData);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['editData'] && !changes['editData'].firstChange && this.editData) {
      this.patchFormData(this.editData);
    }
  }

  patchFormData(data: any) {
    this.form.patchValue({
      title: data?.title || '',
      position: data?.position || '',
      academicLevel: data?.academicLevel || '',
      experience: data?.experience || '',
      career: data?.career || '',
      city: data?.city || '',
      salaryMin: data?.salaryMin || '',
      salaryMax: data?.salaryMax || '',
      typeOfWorkplace: data?.typeOfWorkplace || '',
      jobType: data?.jobType || '',
      description: data?.description || '',
    });
  }

  salaryValidator(form: FormGroup) {
    const salaryMin = form.get('salaryMin')?.value;
    const salaryMax = form.get('salaryMax')?.value;
    if (salaryMin && salaryMax && salaryMin > salaryMax) {
      form.get('salaryMax')?.setErrors({ invalidRange: true });
      return { invalidSalaryRange: true };
    }
    return null;
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

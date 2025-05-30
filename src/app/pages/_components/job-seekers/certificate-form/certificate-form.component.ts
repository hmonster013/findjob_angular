import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-certificate-form',
  standalone: true,
  templateUrl: './certificate-form.component.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class CertificateFormComponent implements OnInit, OnChanges {
  @Input() editData: any = null;
  @Input() handleAddOrUpdate!: (data: any, id?: number) => void;
  @Output() cancelForm = new EventEmitter<void>();

  form!: FormGroup;
  maxYesterday: string = '';
  maxToday: string = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      trainingPlace: ['', [Validators.required, Validators.maxLength(255)]],
      startDate: ['', Validators.required],
      expirationDate: [null],
      noExpiration: [false],
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
        this.form.reset({ noExpiration: false, expirationDate: null });
      }
    }
  }

  patchFormData(data: any) {
    const startDate = data?.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '';
    const expirationDate = data?.expirationDate ? new Date(data.expirationDate).toISOString().split('T')[0] : null;
    this.form.patchValue({
      name: data?.name || '',
      trainingPlace: data?.trainingPlace || '',
      startDate: startDate,
      expirationDate: expirationDate,
      noExpiration: !data?.expirationDate, // Vô thời hạn nếu expirationDate là null
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
    const expirationDate = form.get('expirationDate')?.value;

    if (startDate && expirationDate && new Date(startDate) > new Date(expirationDate)) {
      form.get('expirationDate')?.setErrors({ invalidRange: true });
      return { invalidDateRange: true };
    }

    return null;
  }

  onNoExpirationChange(event: Event) {
    const noExpiration = (event.target as HTMLInputElement).checked;
    if (noExpiration) {
      this.form.get('expirationDate')?.setValue(null);
      this.form.get('expirationDate')?.clearValidators();
    } else {
      this.form.get('expirationDate')?.setValidators(Validators.required);
    }
    this.form.get('expirationDate')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.form.valid && this.handleAddOrUpdate) {
      const id = this.editData?.id;
      const payload = {
        ...this.form.value,
        expirationDate: this.form.value.noExpiration ? null : this.form.value.expirationDate,
      };
      // Loại bỏ noExpiration khỏi payload
      delete payload.noExpiration;
      this.handleAddOrUpdate(payload, id);
    }
  }

  cancel() {
    this.form.reset({ noExpiration: false, expirationDate: null });
    this.cancelForm.emit();
  }
}

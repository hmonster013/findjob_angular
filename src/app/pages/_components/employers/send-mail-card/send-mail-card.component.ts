import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-send-mail-card',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './send-mail-card.component.html',
  styleUrl: './send-mail-card.component.css'
})
export class SendMailCardComponent {
  @Input() openPopup: boolean = false;
  @Input() sendMailData: any = null;
  @Output() setOpenPopup = new EventEmitter<boolean>();
  @Output() handleSendEmail = new EventEmitter<any>();

  mailForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.mailForm = this.fb.group({
      fullName: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(100)]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email, Validators.maxLength(100)]],
      title: ['', [Validators.required, Validators.maxLength(200)]],
      content: ['', [Validators.required]],
      isSendMe: [false],
    });
  }

  ngOnChanges(): void {
    if (this.openPopup) {
      this.resetForm();
    }

    if (this.sendMailData) {
      this.mailForm.patchValue(this.sendMailData);
    }
  }

  onSubmit() {
    if (this.mailForm.valid) {
      this.handleSendEmail.emit(this.mailForm.getRawValue());
    } else {
      this.mailForm.markAllAsTouched();
    }
  }

  resetForm() {
    this.mailForm.reset({
      fullName: '',
      email: '',
      title: '',
      content: '',
      isSendMe: false,
    });
  }

  closePopup() {
    this.setOpenPopup.emit(false);
  }
}

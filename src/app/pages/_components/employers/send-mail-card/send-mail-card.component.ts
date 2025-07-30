import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-send-mail-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QuillModule],
  templateUrl: './send-mail-card.component.html',
  styleUrls: ['./send-mail-card.component.css'],
})
export class SendMailCardComponent implements OnInit, OnDestroy {
  @Input() openPopup: boolean = false;
  @Input() sendMailData: any = null;
  @Output() setOpenPopup = new EventEmitter<boolean>();
  @Output() handleSendEmail = new EventEmitter<any>();

  mailForm: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    this.mailForm = this.fb.group({
      id : '',
      fullName: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(100)]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email, Validators.maxLength(100)]],
      title: ['', [Validators.required, Validators.maxLength(200)]],
      content: ['', [Validators.required, this.contentValidator()]],
      isSendMe: [false],
    });
  }

  ngOnInit(): void {
    // Chỉ subscribe valueChanges nếu cần xử lý lỗi động
  }

  ngOnChanges(): void {
    if (this.openPopup && !this.sendMailData) {
      this.resetForm();
    }
    if (this.sendMailData) {
      this.mailForm.patchValue({
        id: this.sendMailData.id || '',
        fullName: this.sendMailData.fullName || '',
        email: this.sendMailData.email || '',
        title: this.sendMailData.title || '',
        content: this.sendMailData.content || '',
        isSendMe: this.sendMailData.isSendMe || false,
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  contentValidator() {
    return (control: any): { [key: string]: any } | null => {
      const value = control.value;
      const text = value?.replace(/<[^>]*>/g, '').trim();
      return text ? null : { noContent: 'Nội dung email phải có text' };
    };
  }

  onSubmit() {
    if (this.mailForm.valid) {
      this.handleSendEmail.emit(this.mailForm.getRawValue());
      this.closePopup();
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
    this.resetForm();
  }
}

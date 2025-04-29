import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-account-form',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './account-form.component.html',
  styleUrl: './account-form.component.css'
})
export class AccountFormComponent {
  @Input() serverErrors: any = null;
  @Output() update = new EventEmitter<any>();

  accountForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('current_user') || '{}');

    this.accountForm = this.fb.group({
      fullName: [user?.fullName || '', [Validators.required, Validators.maxLength(100)]],
      email: [{ value: user?.email || '', disabled: true }],
      password: [{ value: '*****************', disabled: true }],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['serverErrors'] && this.serverErrors) {
      for (const key in this.serverErrors) {
        if (this.accountForm.controls[key]) {
          this.accountForm.controls[key].setErrors({ server: this.serverErrors[key]?.join(' ') });
        }
      }
    }
  }

  onSubmit() {
    if (this.accountForm.valid) {
      this.update.emit(this.accountForm.getRawValue()); // dùng getRawValue để lấy cả field disabled
    }
  }

}

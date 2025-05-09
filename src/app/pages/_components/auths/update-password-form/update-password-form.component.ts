import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-password-form',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './update-password-form.component.html',
  styleUrls: ['./update-password-form.component.css'],
  standalone: true
})
export class UpdatePasswordFormComponent {
  @Input() serverErrors: any = {};
  @Output() updatePassword = new EventEmitter<any>();

  passwordForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.maxLength(128)]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(128),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: [this.passwordMatchValidator] });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['serverErrors'] && this.serverErrors) {
      for (const key in this.serverErrors) {
        if (this.passwordForm.controls[key]) {
          this.passwordForm.controls[key].setErrors({ server: this.serverErrors[key]?.join(' ') });
        }
      }
    }
  }

  passwordMatchValidator(group: FormGroup): ValidationErrors | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      this.updatePassword.emit(this.passwordForm.value);
    }
  }
}

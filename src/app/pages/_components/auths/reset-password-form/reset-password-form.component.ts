import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-reset-password-form',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './reset-password-form.component.html',
  styleUrl: './reset-password-form.component.css'
})
export class ResetPasswordFormComponent {
  @Output() submitFormEvent = new EventEmitter<{ newPassword: string }>();
  @Input() isSubmitting = false;
  @Input() serverErrors: { [key: string]: string[] } = {};

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(128),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&(){}[\]^~\-_=+<>]).+$/
            )
          ]
        ],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.matchPasswords }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['serverErrors'] && this.serverErrors) {
      Object.entries(this.serverErrors).forEach(([field, messages]) => {
        if (this.form.contains(field)) {
          const control = this.form.get(field);
          control?.setErrors({ server: messages.join(' ') });
        }
      });
    }
  }

  get newPassword(): AbstractControl {
    return this.form.get('newPassword')!;
  }

  get confirmPassword(): AbstractControl {
    return this.form.get('confirmPassword')!;
  }

  matchPasswords(group: FormGroup) {
    const password = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitFormEvent.emit({ newPassword: this.form.value.newPassword });
  }
}

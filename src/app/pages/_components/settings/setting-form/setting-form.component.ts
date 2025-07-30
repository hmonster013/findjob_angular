import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-setting-form',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './setting-form.component.html',
  styleUrls: ['./setting-form.component.css'],
  standalone: true
})
export class SettingFormComponent {
  @Input() editData: any = null;
  @Output() update = new EventEmitter<any>();

  settingForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.settingForm = this.fb.group({
      emailNotificationActive: [false],
      smsNotificationActive: [false],
    });

    if (this.editData) {
      this.settingForm.patchValue(this.editData);
    }
  }

  onSubmit() {
    if (this.settingForm.valid) {
      this.update.emit(this.settingForm.value);
    }
  }
}

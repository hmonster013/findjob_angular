import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-advanced-skill-form',
  standalone: true,
  templateUrl: './advanced-skill-form.component.html',
  styleUrls: ['./advanced-skill-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class AdvancedSkillFormComponent implements OnInit, OnChanges {
  @Input() editData: any = null;
  @Input() serverErrors: any = null;
  @Input() handleAddOrUpdate!: (data: any) => void;

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      level: ['', [Validators.required]],
    });

    if (this.editData) {
      this.form.patchValue(this.editData);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['editData'] && !changes['editData'].firstChange) {
      if (this.editData) {
        this.form.patchValue(this.editData);
      } else {
        this.form.reset();
      }
    }

    if (changes['serverErrors'] && this.serverErrors) {
      for (const field in this.serverErrors) {
        if (this.form.controls[field]) {
          this.form.controls[field].setErrors({
            serverError: this.serverErrors[field]?.join(' ')
          });
        }
      }
    }
  }

  onSubmit() {
    if (this.form.valid && this.handleAddOrUpdate) {
      this.handleAddOrUpdate(this.form.value);
    }
  }
}

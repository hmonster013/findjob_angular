import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-language-skill-form',
  standalone: true,
  templateUrl: './language-skill-form.component.html',
  styleUrls: ['./language-skill-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class LanguageSkillFormComponent implements OnInit, OnChanges {
  @Input() editData: any = null;
  @Input() handleAddOrUpdate!: (data: any) => void;
  @Input() serverErrors: any = null;
  @Input() allConfig: any = {};

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      language: ['', Validators.required],
      level: ['', Validators.required],
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

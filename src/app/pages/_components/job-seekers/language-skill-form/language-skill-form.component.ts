import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-language-skill-form',
  standalone: true,
  templateUrl: './language-skill-form.component.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class LanguageSkillFormComponent implements OnInit, OnChanges {
  @Input() editData: any = null;
  @Input() handleAddOrUpdate!: (data: any, id?: number) => void;
  @Input() allConfig: any = {};
  @Input() existingLanguages: any[] = [];
  @Output() cancelForm = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      language: ['', Validators.required],
      level: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
    }, { validators: this.languageValidator.bind(this) });

    if (this.editData) {
      this.patchFormData(this.editData);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['editData'] && !changes['editData'].firstChange) {
      if (this.editData) {
        this.patchFormData(this.editData);
      } else {
        this.form.reset();
      }
    }
  }

  patchFormData(data: any) {
    this.form.patchValue({
      language: data?.language || '',
      level: data?.level || '',
    });
  }

  languageValidator(form: FormGroup) {
    const language = form.get('language')?.value;
    const id = this.editData?.id;

    if (language && this.existingLanguages.some(skill => skill.language == language && skill.id !== id)) {
      form.get('language')?.setErrors({ duplicate: true });
      return { duplicateLanguage: true };
    }

    return null;
  }

  onSubmit() {
    if (this.form.valid && this.handleAddOrUpdate) {
      const id = this.editData?.id;
      this.handleAddOrUpdate(this.form.value, id);
    }
  }

  cancel() {
    this.form.reset();
    this.cancelForm.emit();
  }
}

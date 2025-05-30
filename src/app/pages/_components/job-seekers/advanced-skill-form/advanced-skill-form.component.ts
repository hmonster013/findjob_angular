import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-advanced-skill-form',
  standalone: true,
  templateUrl: './advanced-skill-form.component.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class AdvancedSkillFormComponent implements OnInit, OnChanges {
  @Input() editData: any = null;
  @Input() handleAddOrUpdate!: (data: any, id?: number) => void;
  @Input() existingSkills: any[] = [];
  @Output() cancelForm = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      level: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
    }, { validators: this.skillValidator.bind(this) });

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
      name: data?.name || '',
      level: data?.level || '',
    });
  }

  skillValidator(form: FormGroup) {
    const name = form.get('name')?.value;
    const id = this.editData?.id;

    if (name && this.existingSkills.some(skill => skill.name.toLowerCase() === name.toLowerCase() && skill.id !== id)) {
      form.get('name')?.setErrors({ duplicate: true });
      return { duplicateSkill: true };
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

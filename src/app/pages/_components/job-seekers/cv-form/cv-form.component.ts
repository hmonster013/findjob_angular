import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cv-form',
  standalone: true,
  templateUrl: './cv-form.component.html',
  styleUrls: ['./cv-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class CvFormComponent implements OnInit {
  @Input() handleUpdate!: (data: any) => void;

  form!: FormGroup;
  fileError: string | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      files: [null, Validators.required],
    });
  }

  onSubmit() {
    if (!this.form.value.files) {
      this.fileError = 'Tập tin là bắt buộc.';
      return;
    } else {
      this.fileError = null;
    }

    if (this.form.valid && this.handleUpdate) {
      this.handleUpdate(this.form.value);
    }
  }

  onFileChange(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.form.patchValue({ files: files });
      this.fileError = null;
    } else {
      this.form.patchValue({ files: null });
    }
  }
}

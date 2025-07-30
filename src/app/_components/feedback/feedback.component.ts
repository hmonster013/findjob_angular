import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-feedback',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent {
  open = false;
  loading = false;
  rating = 5;
  hover = 0;
  stars = Array(5);

  feedbackForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.feedbackForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  openModal() {
    this.open = true;
  }

  closeModal() {
    this.open = false;
    this.hover = 0;
  }

  setRating(value: number) {
    this.rating = value;
  }

  async onSubmit() {
    if (this.feedbackForm.invalid) return;

    const data = {
      rating: this.rating,
      content: this.feedbackForm.value.content,
    };

    this.loading = true;

    try {
      console.log('Gửi dữ liệu:', data);
      // await this.myjobService.createFeedback(data); // gọi service thực tế
      this.closeModal();
      alert('Gửi phản hồi thành công!');
    } catch (error) {
      console.error('Lỗi gửi feedback', error);
    } finally {
      this.loading = false;
    }
  }
}

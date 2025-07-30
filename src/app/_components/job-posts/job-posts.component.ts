import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { JobPostComponent } from "../job-post/job-post.component";

@Component({
  selector: 'app-job-posts',
  imports: [
    CommonModule,
    JobPostComponent
],
  templateUrl: './job-posts.component.html',
  styleUrl: './job-posts.component.css'
})
export class JobPostsComponent {
  items = Array(12); // 12 JobPost mẫu
  currentPage = 1;
  totalPages = 10;

  changePage(page: number) {
    this.currentPage = page;
    console.log('Page changed to:', page);
    // Gọi API hoặc load lại dữ liệu tại đây
  }
}

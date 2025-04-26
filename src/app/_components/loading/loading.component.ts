import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingService } from '../../_services/loading.service';

@Component({
  selector: 'app-loading',
  imports: [
    CommonModule
  ],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent {
  constructor(public loadingService: LoadingService) {}
}

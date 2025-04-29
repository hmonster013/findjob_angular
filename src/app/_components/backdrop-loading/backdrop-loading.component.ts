import { Component, Input } from '@angular/core';
import { LOADING_IMAGES } from '../../_configs/constants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-backdrop-loading',
  imports: [
    CommonModule
  ],
  templateUrl: './backdrop-loading.component.html',
  styleUrl: './backdrop-loading.component.css'
})
export class BackdropLoadingComponent {
  @Input() bgColor: string = 'rgba(0, 0, 0, 0.4)';
  @Input() open: boolean = true;

  spinnerUrl: string = LOADING_IMAGES.LOADING_SPINNER;
}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-color-picker-dialog',
  imports: [
    CommonModule
  ],
  templateUrl: './color-picker-dialog.component.html',
  styleUrl: './color-picker-dialog.component.css'
})
export class ColorPickerDialogComponent {
  @Input() open: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() colorSelect = new EventEmitter<string>();

  selectedColor: string = '#673ab7'; // màu tím mặc định
  showCustomPicker: boolean = false;

  defaultColors: string[] = [
    '#673ab7', // Purple
    '#2196f3', // Blue
    '#4caf50', // Green
    '#f44336', // Red
    '#ff9800', // Orange
  ];

  handleColorSelect(color: string) {
    this.selectedColor = color;
    this.showCustomPicker = false;
  }

  handleCustomColorChange(event: any) {
    this.selectedColor = event.target.value;
  }

  toggleCustomPicker() {
    this.showCustomPicker = true;
  }

  handleConfirm() {
    this.colorSelect.emit(this.selectedColor);
    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }
}

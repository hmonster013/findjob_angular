import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dropzone-dialog-custom',
  imports: [
    CommonModule
  ],
  templateUrl: './dropzone-dialog-custom.component.html',
  styleUrl: './dropzone-dialog-custom.component.css'
})
export class DropzoneDialogCustomComponent {
  @Input() open: boolean = false;
  @Input() title: string = 'Tải lên tệp';
  @Output() setOpen = new EventEmitter<boolean>();
  @Output() handleUploadEvent = new EventEmitter<File[]>();

  selectedFiles: File[] = [];
  previewUrls: string[] = [];

  handleClose() {
    this.selectedFiles = [];
    this.previewUrls = [];
    this.setOpen.emit(false);
  }

  onFileSelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    this.loadPreviews(files);
    this.selectedFiles = files;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      const files = Array.from(event.dataTransfer.files) as File[];
      this.loadPreviews(files);
      this.selectedFiles = files;
    }
  }

  handleUpload() {
    this.handleUploadEvent.emit(this.selectedFiles);
    this.handleClose();
  }

  private loadPreviews(files: File[]) {
    this.previewUrls = files.map(file => URL.createObjectURL(file));
  }
}

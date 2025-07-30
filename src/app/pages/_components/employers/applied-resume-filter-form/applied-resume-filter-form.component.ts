import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-applied-resume-filter-form',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './applied-resume-filter-form.component.html',
  styleUrl: './applied-resume-filter-form.component.css'
})
export class AppliedResumeFilterFormComponent {
  @Input() allConfig: any = {};
  @Input() filterData: any = {};
  @Output() handleFilter = new EventEmitter<any>();

  form: FormGroup;

  fields = [
    { label: 'Tỉnh/Thành phố', controlName: 'cityId', placeholder: 'Chọn Tỉnh/Thành phố', optionKey: 'cityOptions' },
    { label: 'Ngành nghề', controlName: 'careerId', placeholder: 'Tất cả ngành nghề', optionKey: 'careerOptions' },
    { label: 'Kinh nghiệm', controlName: 'experienceId', placeholder: 'Tất cả kinh nghiệm', optionKey: 'experienceOptions' },
    { label: 'Cấp bậc', controlName: 'positionId', placeholder: 'Tất cả cấp bậc', optionKey: 'positionOptions' },
    { label: 'Học vấn', controlName: 'academicLevelId', placeholder: 'Tất cả học vấn', optionKey: 'academicLevelOptions' },
    { label: 'Nơi làm việc', controlName: 'typeOfWorkplaceId', placeholder: 'Tất cả nơi làm việc', optionKey: 'typeOfWorkplaceOptions' },
    { label: 'Hình thức làm việc', controlName: 'jobTypeId', placeholder: 'Tất cả hình thức làm việc', optionKey: 'jobTypeOptions' },
    { label: 'Giới tính', controlName: 'genderId', placeholder: 'Tất cả giới tính', optionKey: 'genderOptions' },
    { label: 'Tình trạng hôn nhân', controlName: 'maritalStatusId', placeholder: 'Tất cả tình trạng hôn nhân', optionKey: 'maritalStatusOptions' },
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      cityId: [''],
      careerId: [''],
      experienceId: [''],
      positionId: [''],
      academicLevelId: [''],
      typeOfWorkplaceId: [''],
      jobTypeId: [''],
      genderId: [''],
      maritalStatusId: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filterData'] && this.filterData) {
      this.form.patchValue(this.filterData);
    }
  }

  onSubmit() {
    this.handleFilter.emit(this.form.value);
  }
}

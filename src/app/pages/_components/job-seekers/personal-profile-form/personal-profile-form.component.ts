import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonService } from '../../../../_services/common.service';

@Component({
  selector: 'app-personal-profile-form',
  standalone: true,
  templateUrl: './personal-profile-form.component.html',
  styleUrls: ['./personal-profile-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class PersonalProfileFormComponent implements OnInit, OnChanges {
  @Input() editData: any = null;
  @Input() handleUpdateProfile!: (data: any) => void;
  @Input() allConfig: any = {};

  form!: FormGroup;
  districtOptions: any[] = [];
  maxYesterday: string = '';

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      user: this.fb.group({
        fullName: ['', [Validators.required, Validators.maxLength(100)]],
      }),
      phone: ['', [Validators.required, Validators.maxLength(15)]],
      birthday: ['', Validators.required],
      gender: ['', [Validators.required, Validators.maxLength(1)]],
      maritalStatus: ['', [Validators.required, Validators.maxLength(1)]],
      location: this.fb.group({
        city: ['', Validators.required],
        district: ['', Validators.required],
        address: ['', [Validators.required, Validators.maxLength(255)]],
      }),
    });

    this.setMaxYesterday();
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
      phone: data?.phone || '',
      birthday: data?.birthday || '',
      gender: data?.gender || '',
      maritalStatus: data?.maritalStatus || '',
      user: {
        fullName: data?.user?.fullName || '',
      },
      location: {
        city: data?.location?.city || '',
        district: data?.location?.district || '',
        address: data?.location?.address || '',
      },
    });
  }

  setMaxYesterday() {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    this.maxYesterday = today.toISOString().split('T')[0];
  }

  onCityChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement?.value;

    if (value) {
      const cityId = Number(value); // 💥 ép kiểu từ string thành number

      this.commonService.getDistrictsByCityId(cityId).subscribe({
        next: (res) => {
          this.districtOptions = res.data;
          this.form.get('location')?.get('district')?.setValue('');
        },
        error: (err) => {
          console.error('Error loading districts:', err);
        },
      });
    }
  }



  onSubmit() {
    if (this.form.valid && this.handleUpdateProfile) {
      this.handleUpdateProfile(this.form.value);
    }
  }
}

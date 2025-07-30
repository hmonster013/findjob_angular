import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonService } from '../../../../_services/common.service';

@Component({
  selector: 'app-personal-profile-form',
  standalone: true,
  templateUrl: './personal-profile-form.component.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class PersonalProfileFormComponent implements OnInit, OnChanges {
  @Input() editData: any = null;
  @Input() handleUpdateProfile!: (data: any) => void;
  @Input() allConfig: any = {};
  @Output() cancelForm = new EventEmitter<void>();

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
      phone: ['', [Validators.required, Validators.pattern(/^(0[3|5|7|8|9])+([0-9]{8})$/)]],
      birthday: ['', Validators.required],
      gender: ['', Validators.required],
      maritalStatus: ['', Validators.required],
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
    if (changes['editData'] && !changes['editData'].firstChange && this.editData) {
      this.patchFormData(this.editData);
    }
  }

  patchFormData(data: any) {
    const birthday = data?.birthday ? new Date(data.birthday).toISOString().split('T')[0] : '';
    this.form.patchValue({
      user: {
        fullName: data?.user?.fullName || '',
      },
      phone: data?.phone || '',
      birthday: birthday,
      gender: data?.gender || '',
      maritalStatus: data?.maritalStatus || '',
      location: {
        city: data?.location?.city || '',
        district: data?.location?.district || '',
        address: data?.location?.address || '',
      },
    });

    if (data?.location?.city) {
      this.loadDistricts(Number(data.location.city));
    } else {
      this.districtOptions = [];
    }
  }

  setMaxYesterday() {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    this.maxYesterday = today.toISOString().split('T')[0];
  }

  loadDistricts(cityId: number) {
    this.commonService.getDistrictsByCityId(cityId).subscribe({
      next: (res) => {
        this.districtOptions = (res.data || []).map((district: any) => ({
          value: district.id,
          label: district.name,
        }));
      },
      error: (err) => {
        console.error('Error loading districts:', err);
        this.districtOptions = [];
      },
    });
  }

  onCityChange(event: Event) {
    const cityId = (event.target as HTMLSelectElement).value;
    if (cityId) {
      this.loadDistricts(Number(cityId));
      this.form.get('location.district')?.setValue('');
    } else {
      this.districtOptions = [];
      this.form.get('location.district')?.setValue('');
    }
  }

  onSubmit() {
    if (this.form.valid && this.handleUpdateProfile) {
      this.handleUpdateProfile(this.form.value);
    }
  }

  close() {
    this.cancelForm.emit(); // Chỉ phát sự kiện để đóng modal
  }
}

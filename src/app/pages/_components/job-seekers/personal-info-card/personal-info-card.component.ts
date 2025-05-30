import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { PersonalProfileFormComponent } from '../personal-profile-form/personal-profile-form.component';
import { JobSeekerProfileService } from '../../../../_services/job-seeker-profile.service';
import { CommonService } from '../../../../_services/common.service';

@Component({
  selector: 'app-personal-info-card',
  standalone: true,
  templateUrl: './personal-info-card.component.html',
  imports: [CommonModule, PersonalProfileFormComponent],
})
export class PersonalInfoCardComponent implements OnInit {
  profile: any = null;
  isLoadingProfile = true;
  isFullScreenLoading = false;
  openPopup = false;
  allConfig: any;
  districtOptions: any[] = [];

  constructor(
    private jobSeekerProfileService: JobSeekerProfileService,
    private commonService: CommonService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getConfigs();
    this.fetchProfile();
  }

  getConfigs() {
    this.commonService.getConfigs().subscribe({
      next: (res) => {
        this.allConfig = res.data;
      },
      error: (err) => {
        this.toastr.error('Lỗi khi tải cấu hình!');
      },
    });
  }

  fetchProfile() {
    this.isLoadingProfile = true;
    this.jobSeekerProfileService.getProfile().subscribe({
      next: (res) => {
        this.profile = res.data || null;
        if (this.profile?.location?.city) {
          this.loadDistricts(Number(this.profile.location.city));
        }
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
        this.toastr.error('Có lỗi khi tải thông tin cá nhân!');
      },
      complete: () => {
        this.isLoadingProfile = false;
      },
    });
  }

  loadDistricts(cityId: number) {
    this.commonService.getDistrictsByCityId(cityId).subscribe({
      next: (res) => {
        // Ánh xạ id -> value, name -> label để đồng bộ với code hiện tại
        this.districtOptions = (res.data || []).map((district: any) => ({
          value: district.id,
          label: district.name,
        }));
      },
      error: (err) => {
        console.error('Error loading districts:', err);
        this.toastr.error('Lỗi khi tải danh sách quận/huyện!');
        this.districtOptions = [];
      },
    });
  }

  getDistrictName(districtId: number | string): string {
    const district = this.districtOptions.find(d => d.value == districtId);
    return district ? district.label : 'Chưa cập nhật';
  }

  handleShowEdit() {
    this.openPopup = true;
  }

  handleUpdate = (data: any) => {
    this.isFullScreenLoading = true;
    this.jobSeekerProfileService.updateProfile(data).subscribe({
      next: () => {
        this.toastr.success('Cập nhật thông tin cá nhân thành công!');
        this.fetchProfile();
        this.openPopup = false;
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.toastr.error(err.error?.message || 'Có lỗi khi cập nhật thông tin!');
      },
      complete: () => {
        this.isFullScreenLoading = false;
      },
    });
  };
}

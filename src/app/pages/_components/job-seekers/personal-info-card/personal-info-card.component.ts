import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { PersonalProfileFormComponent } from '../personal-profile-form/personal-profile-form.component';
import { JobSeekerProfileService } from '../../../../_services/job-seeker-profile.service';

@Component({
  selector: 'app-personal-info-card',
  standalone: true,
  templateUrl: './personal-info-card.component.html',
  styleUrls: ['./personal-info-card.component.css'],
  imports: [
    CommonModule,
    PersonalProfileFormComponent
  ],
})
export class PersonalInfoCardComponent implements OnInit {
  profile: any = null;
  isLoadingProfile = true;
  isFullScreenLoading = false;
  openPopup = false;

  constructor(
    private jobSeekerProfileService: JobSeekerProfileService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchProfile();
  }

  fetchProfile() {
    this.isLoadingProfile = true;
    this.jobSeekerProfileService.getProfile().subscribe({
      next: (res) => {
        this.profile = res.data || null;
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
      },
      complete: () => {
        this.isLoadingProfile = false;
      }
    });
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
      },
      complete: () => {
        this.isFullScreenLoading = false;
      }
    });
  };
}

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AuthenticationService } from '../../../../_services/authentication.service';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { SettingFormComponent } from "../setting-form/setting-form.component";

@Component({
  selector: 'app-setting-card',
  imports: [
    CommonModule,
    SettingFormComponent
  ],
  templateUrl: './setting-card.component.html',
  styleUrls: ['./setting-card.component.css'],
  standalone: true
})
export class SettingCardComponent {
  @Input() title: string = '';

  isLoadingSettings = true;
  editData: any = null;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthenticationService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadSettings();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSettings() {
    this.isLoadingSettings = true;
    this.authService.getUserSettings()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.editData = res.data;
          this.isLoadingSettings = false;
        },
        error: (err) => {
          console.error('Failed to load settings', err);
          this.isLoadingSettings = false;
        }
      });
  }

  handleUpdateUserSetting(data: any) {
    this.authService.updateUserSettings(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.editData = res.data;
          this.toastr.success('Cập nhật setting thành công!');
        },
        error: (err) => {
          console.error('Failed to update settings', err);
          this.toastr.error('Cập nhật setting thất bại!');
        }
      });
  }
}

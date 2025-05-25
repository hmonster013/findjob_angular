import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APP_NAME } from '../../../_configs/constants';

@Component({
  selector: 'app-about-us-page',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './about-us-page.component.html',
})
export class AboutUsPageComponent {
  readonly APP_NAME = APP_NAME;

  readonly features = [
    {
      title: 'Chọn đúng việc - Đi đúng hướng',
      icon: 'clock', // Font Awesome icon: fa-clock
      description:
        'Khám phá công việc phù hợp với định hướng nghề nghiệp. Thông tin chi tiết về yêu cầu công việc, môi trường và cơ hội phát triển tại mỗi công ty.',
    },
    {
      title: 'Tạo CV & Profile',
      icon: 'user-tie', // Font Awesome icon: fa-user-tie
      description:
        'Xây dựng hồ sơ ứng tuyển chuyên nghiệp với công cụ tạo CV thông minh. Tối ưu profile với các mẫu CV đẹp mắt theo từng ngành nghề.',
    },
    {
      title: 'Việc làm xung quanh bạn',
      icon: 'map-marker-alt', // Font Awesome icon: fa-map-marker-alt
      description:
        'Tìm kiếm cơ hội việc làm lý tưởng trong khu vực. Với tính năng định vị thông minh, gợi ý công việc phù hợp gần nơi bạn sinh sống.',
    },
    {
      title: 'Thông báo việc làm mọi lúc',
      icon: 'bell', // Font Awesome icon: fa-bell
      description:
        'Không bỏ lỡ cơ hội với hệ thống thông báo thông minh. Nhận thông tin tức thì về các vị trí việc làm mới phù hợp với kỹ năng.',
    },
  ];
}

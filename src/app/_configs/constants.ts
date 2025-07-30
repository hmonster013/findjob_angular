import dayjs from 'dayjs'
import { environment } from "../../environments/environment";

// Biến môi trường & App info
export const ENV = environment.production ? 'production' : 'development';
export const PLATFORM = 'WEB';
export const APP_NAME = 'UTTJob';

export const HOST_NAME = {
  MYJOB: environment.FINDJOB_HOST_NAME || '127.0.0.1',
  EMPLOYER_MYJOB: environment.EMPLOYER_FINDJOB_HOST_NAME || 'localhost',
};

export const AUTH_PROVIDER = {
  FACEBOOK: 'facebook',
  GOOGLE: 'google-oauth2',
};

export const AUTH_CONFIG = {
  CLIENT_ID: environment.FINDJOB_SERVER_CLIENT_ID,
  CLIENT_SECRET: environment.FINDJOB_SERVER_CLIENT_SECRECT,
  BACKEND_KEY: 'backend',
  ACCESS_TOKEN_KEY: 'access_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  PASSWORD_KEY: 'password',
  CONVERT_TOKEN_KEY: 'convert_token',

  FACEBOOK_CLIENT_ID: environment.FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET: environment.FACEBOOK_CLIENT_SECRET,

  GOOGLE_CLIENT_ID: environment.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: environment.GOOGLE_CLIENT_SECRET,

  GOONGAPI_KEY: environment.GOONGAPI_KEY,
  GOONGAPI_ACCESS_TOKEN: environment.GOONGAPI_ACCESS_TOKEN,
};

export const ROLES_NAME = {
  ADMIN: 'ADMIN',
  EMPLOYER: 'EMPLOYER',
  JOB_SEEKER: 'JOB_SEEKER',
};

export const HOME_FILTER_CAREER = [
  { id: 34, name: 'IT - Phần mềm', icon: 'devices' },
  { id: 33, name: 'IT - Phần cứng/Mạng', icon: 'developer_board' },
];

export const REGEX_VALIDATE = {
  phoneRegExp:
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
  urlRegExp:
    /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
};

export const CV_TYPES = {
  cvWebsite: 'WEBSITE',
  cvUpload: 'UPLOAD',
};

export const DATE_OPTIONS = {
  yesterday: dayjs().add(-1, 'day'),
  today: dayjs(),
  tomorrow: dayjs().add(1, 'day'),
  dayCustom: (num: number) => dayjs().add(num, 'day'),
};

export const IMAGES = {
  logoWhite: 'assets/logo/school-logo.webp',
  logoBlack: 'assets/logo/school-logo.webp',
  getTextLogo: (mode: string) => `assets/logo/${mode}-text-logo.png`,
  coverImageDefault: 'assets/images/company-cover.avif',
  imageDefault: 'assets/images/image-default.jpg',
  notificationImageDefault: 'assets/images/noti-img-default.png',
};

export const ICONS = {
  INSTAGRAM: 'assets/icons/instagram-icon.png',
  FACEBOOK: 'assets/icons/facebook-icon.png',
  FACEBOOK_MESSENGER: 'assets/icons/facebook-messenger-icon.png',
  LINKEDIN: 'assets/icons/linkedin-icon.png',
  TWITTER: 'assets/icons/twitter-icon.png',
  YOUTUBE: 'assets/icons/youtube-icon.png',
  LOCATION_MARKER: 'assets/icons/location-marker.gif',
  JOB_SEEKER_CHATBOT_ICON: 'assets/icons/job_seeker_chatbot_icon.gif',
  EMPLOYER_CHATBOT_ICON: 'assets/icons/employer_chatbot_icon.gif',
};

export const LINKS = {
  CHPLAY_LINK: 'https://play.google.com/store/',
  APPSTORE_LINK: 'https://www.apple.com/app-store/',
  CERTIFICATE_LINK: 'http://online.gov.vn/',
  INSTAGRAM_LINK: 'https://www.instagram.com/',
  FACEBOOK_LINK: 'https://www.facebook.com/',
  FACEBOOK_MESSENGER_LINK: 'https://www.facebook.com/',
  LINKEDIN_LINK: 'https://www.linkedin.com/',
  TWITTER_LINK: 'https://twitter.com/',
  YOUTUBE_LINK: 'https://www.youtube.com/',
};

export const LOADING_IMAGES = {
  LOADING_SPINNER: 'assets/images/loading/loading-spinner.gif',
};

export const LOGO_IMAGES = {
  LOGO_WITH_BG: 'assets/logo/logo-with-bg.jpg',
};

export const BANNER_TYPES = {
  HOME: 'HOME',
  MAIN_JOB_RIGHT: 'MAIN_JOB_RIGHT',
};

export const JOB_POST_STATUS_BG_COLOR = {
  1: 'warning',
  2: 'error',
  3: 'success',
};

export const ROUTES = {
  AUTH: {
    EMAIL_VERIFICATION: 'email-verification',
    LOGIN: 'dang-nhap',
    REGISTER: 'dang-ky',
    FORGOT_PASSWORD: 'quen-mat-khau',
    RESET_PASSWORD: 'cap-nhat-mat-khau/:token',
  },
  ERROR: {
    NOT_FOUND: '*',
    FORBIDDEN: 'forbidden',
  },
  JOB_SEEKER: {
    HOME: '',
    JOBS: 'viec-lam',
    JOB_DETAIL: 'viec-lam/:slug',
    COMPANY: 'cong-ty',
    COMPANY_DETAIL: 'cong-ty/:slug',
    ABOUT_US: 've-chung-toi',
    JOBS_BY_CAREER: 'viec-lam-theo-nganh-nghe',
    JOBS_BY_CITY: 'viec-lam-theo-tinh-thanh',
    JOBS_BY_TYPE: 'viec-lam-theo-hinh-thuc-lam-viec',
    DASHBOARD: 'bang-dieu-khien',
    PROFILE: 'ho-so',
    STEP_PROFILE: 'ho-so-tung-buoc',
    ATTACHED_PROFILE: 'ho-so-dinh-kem',
    MY_JOB: 'viec-lam-cua-toi',
    MY_COMPANY: 'cong-ty-cua-toi',
    NOTIFICATION: 'thong-bao',
    ACCOUNT: 'tai-khoan',
    CHAT: 'ket-noi-voi-nha-tuyen-dung',
  },
  EMPLOYER: {
    INTRODUCE: 'gioi-thieu',
    SERVICE: 'dich-vu',
    PRICING: 'bao-gia',
    SUPPORT: 'ho-tro',
    BLOG: 'blog-tuyen-dung',
    DASHBOARD: '',
    JOB_POST: 'tin-tuyen-dung',
    APPLIED_PROFILE: 'ho-so-ung-tuyen',
    SAVED_PROFILE: 'ho-so-da-luu',
    PROFILE: 'danh-sach-ung-vien',
    PROFILE_DETAIL: 'chi-tiet-ung-vien/:slug',
    COMPANY: 'cong-ty',
    NOTIFICATION: 'thong-bao',
    ACCOUNT: 'tai-khoan',
    SETTING: 'cai-dat',
    CHAT: 'ket-noi-voi-ung-vien',
  },
};

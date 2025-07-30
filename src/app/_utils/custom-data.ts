// custom-data.utils.ts

export function convertMoney(n: number): string {
  if (n >= 1_000_000_000) {
    return `${Math.trunc(n / 1_000_000_000)} tỉ`;
  } else if (n >= 1_000_000) {
    return `${Math.trunc(n / 1_000_000)} tr`;
  } else {
    return `${Math.trunc(n)}`;
  }
}

export function salaryString(salaryFrom?: number, salaryTo?: number): string {
  if (!salaryFrom && !salaryTo) return '---';
  return `${!salaryFrom ? '?' : convertMoney(salaryFrom)} - ${!salaryTo ? '?' : convertMoney(salaryTo)}`;
}

export function toSlug(str: string): string {
  str = str.toLowerCase();
  str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a')
           .replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e')
           .replace(/(ì|í|ị|ỉ|ĩ)/g, 'i')
           .replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o')
           .replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u')
           .replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y')
           .replace(/(đ)/g, 'd')
           .replace(/([^0-9a-z-\s])/g, '')
           .replace(/(\s+)/g, '-')
           .replace(/^-+/g, '')
           .replace(/-+$/g, '');
  return str;
}

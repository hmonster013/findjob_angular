// func-utils.ts

export async function downloadPdf(url: string, fileName?: string): Promise<void> {
  const appName = 'MyJob'; // Hoặc bạn import APP_NAME từ environment nếu cần
  const fileDownloadName = `${appName}_CV-${toSlug(fileName || 'mytitle')}`;
  const response = await fetch(url);
  const blob = await response.blob();
  const urlBlob = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement('a');
  link.href = urlBlob;
  link.setAttribute('download', `${fileDownloadName}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
}

export function formatRoute(route: string, value: string, paramKey = ':slug'): string {
  const regex = new RegExp(`${paramKey}`, 'g');
  return route.replace(regex, value);
}

export function buildURL(hostname: string): string {
  const protocol = window.location.protocol;
  const port = window.location.port ? `:${window.location.port}` : '';
  return `${protocol}//${hostname}${port}`;
}

function toSlug(str: string): string {
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

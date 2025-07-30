export function formatDate(input: string | number | Date): string {
  const now = new Date();
  const date = new Date(input);

  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  const timeFormatter = new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const dateTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  if (isToday) {
    return `Hôm nay ${timeFormatter.format(date)}`;
  } else if (isYesterday) {
    return `Hôm qua ${timeFormatter.format(date)}`;
  } else if (diffInDays <= 7) {
    return `${dateTimeFormatter.format(date)}`;
  } else {
    return `${dateTimeFormatter.format(date)}`;
  }
}

import Swal, { SweetAlertIcon } from 'sweetalert2';

/**
 * Hiển thị Confirm Modal (Có Yes/No)
 *
 * @param onConfirm Hàm callback khi nhấn Đồng ý
 * @param title Tiêu đề
 * @param text Nội dung phụ
 * @param icon Icon swal ('success', 'warning', 'error', 'info', 'question')
 * @param showCancelButton Có hiển thị nút Cancel hay không
 * @param confirmButtonText Text nút Đồng ý
 * @param cancelButtonText Text nút Hủy
 */
export function confirmModal(
  onConfirm: () => void,
  title: string = '',
  text: string = '',
  icon: SweetAlertIcon = 'success',
  showCancelButton: boolean = true,
  confirmButtonText: string = 'Đồng ý',
  cancelButtonText: string = 'Hủy'
): Promise<void> {
  return Swal.fire({
    title: title,
    html: text,
    icon: icon,
    confirmButtonColor: '#441da0',
    showCancelButton: showCancelButton,
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
    }
    return; // 🔥 THÊM dòng này ➔ thành Promise<void>
  });
}

/**
 * Hiển thị Error Modal
 *
 * @param title Tiêu đề lỗi
 * @param text Nội dung lỗi
 */
export function errorModal(
  title: string = '',
  text: string = ''
): Promise<void> {
  return Swal.fire({
    icon: 'error',
    title: title,
    html: text,
    confirmButtonColor: '#441da0',
  }).then(() => {
    return; // 🔥 THÊM dòng này
  });
}

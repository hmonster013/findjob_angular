import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'; // import sweetalert2

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor() {}

  confirm({ title, text, icon = 'warning', onConfirm }: { title: string; text: string; icon?: any; onConfirm: () => void }) {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      }
    });
  }

  alertSuccess(message: string) {
    Swal.fire('Thành công!', message, 'success');
  }

  alertError(message: string) {
    Swal.fire('Lỗi!', message, 'error');
  }
}

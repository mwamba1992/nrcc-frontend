import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  /**
   * Show a generic confirmation dialog
   */
  async confirm(
    title: string,
    message: string,
    confirmText: string = 'Yes',
    cancelText: string = 'Cancel',
    confirmColor: string = '#3b82f6'
  ): Promise<boolean> {
    const result = await Swal.fire({
      title: title,
      html: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: confirmColor,
      cancelButtonColor: '#6b7280',
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      reverseButtons: true,
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        htmlContainer: 'swal-custom-html',
        confirmButton: 'swal-custom-confirm',
        cancelButton: 'swal-custom-cancel'
      },
      focusCancel: true
    });

    return result.isConfirmed;
  }

  /**
   * Show a confirmation dialog for delete actions
   */
  async confirmDelete(itemName: string, itemType: string = 'record'): Promise<boolean> {
    const result = await Swal.fire({
      title: 'Are you sure?',
      html: `You are about to delete <strong>"${itemName}"</strong>.<br/>This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        htmlContainer: 'swal-custom-html',
        confirmButton: 'swal-custom-confirm',
        cancelButton: 'swal-custom-cancel'
      },
      focusCancel: true
    });

    return result.isConfirmed;
  }

  /**
   * Show a confirmation dialog for toggle status actions
   */
  async confirmToggleStatus(itemName: string, currentStatus: string, newStatus: string): Promise<boolean> {
    const action = newStatus === 'ACTIVE' ? 'activate' : 'deactivate';
    const color = newStatus === 'ACTIVE' ? '#22c55e' : '#f59e0b';

    const result = await Swal.fire({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} ${itemName}?`,
      html: `Are you sure you want to ${action} <strong>"${itemName}"</strong>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: color,
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        htmlContainer: 'swal-custom-html',
        confirmButton: 'swal-custom-confirm',
        cancelButton: 'swal-custom-cancel'
      },
      focusCancel: true
    });

    return result.isConfirmed;
  }

  /**
   * Show a success message
   */
  success(title: string, message?: string): void {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      confirmButtonColor: '#3b82f6',
      confirmButtonText: 'OK',
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        confirmButton: 'swal-custom-confirm'
      },
      timer: 3000,
      timerProgressBar: true
    });
  }

  /**
   * Show an error message
   */
  error(title: string, message?: string): void {
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'OK',
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        confirmButton: 'swal-custom-confirm'
      }
    });
  }

  /**
   * Show a warning message
   */
  warning(title: string, message?: string): void {
    Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      confirmButtonColor: '#f59e0b',
      confirmButtonText: 'OK',
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        confirmButton: 'swal-custom-confirm'
      }
    });
  }

  /**
   * Show an info message
   */
  info(title: string, message?: string): void {
    Swal.fire({
      title: title,
      text: message,
      icon: 'info',
      confirmButtonColor: '#3b82f6',
      confirmButtonText: 'OK',
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        confirmButton: 'swal-custom-confirm'
      }
    });
  }

  /**
   * Show a loading spinner
   */
  showLoading(title: string = 'Processing...'): void {
    Swal.fire({
      title: title,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title'
      },
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  /**
   * Close the current Swal
   */
  close(): void {
    Swal.close();
  }
}

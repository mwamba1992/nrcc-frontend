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

  /**
   * Show a confirmation dialog with a text input for comments
   */
  async confirmWithComment(
    title: string,
    message: string,
    inputPlaceholder: string = 'Enter your comments...',
    confirmText: string = 'Submit',
    cancelText: string = 'Cancel',
    confirmColor: string = '#3b82f6',
    inputRequired: boolean = false
  ): Promise<{ confirmed: boolean; comment: string }> {
    const result = await Swal.fire({
      title: title,
      html: message,
      icon: 'question',
      input: 'textarea',
      inputPlaceholder: inputPlaceholder,
      inputAttributes: {
        'aria-label': 'Comments'
      },
      inputValidator: inputRequired ? (value) => {
        if (!value || !value.trim()) {
          return 'Please enter a comment';
        }
        return null;
      } : undefined,
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
        cancelButton: 'swal-custom-cancel',
        input: 'swal-custom-textarea'
      },
      focusCancel: false
    });

    return {
      confirmed: result.isConfirmed,
      comment: result.value || ''
    };
  }

  /**
   * Show a decision dialog with approve/disapprove options and reason input
   */
  async decisionDialog(
    title: string,
    message: string
  ): Promise<{ confirmed: boolean; decision: 'APPROVE' | 'DISAPPROVE' | null; reason: string }> {
    const result = await Swal.fire({
      title: title,
      html: `
        <p style="margin-bottom: 16px;">${message}</p>
        <div style="text-align: left; margin-bottom: 12px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">Decision:</label>
          <div style="display: flex; gap: 12px;">
            <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
              <input type="radio" name="decision" value="APPROVE" id="decision-approve" style="width: 16px; height: 16px;">
              <span style="color: #22c55e; font-weight: 500;">Approve</span>
            </label>
            <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
              <input type="radio" name="decision" value="DISAPPROVE" id="decision-disapprove" style="width: 16px; height: 16px;">
              <span style="color: #ef4444; font-weight: 500;">Disapprove</span>
            </label>
          </div>
        </div>
      `,
      input: 'textarea',
      inputPlaceholder: 'Enter reason for your decision...',
      inputAttributes: {
        'aria-label': 'Reason'
      },
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Submit Decision',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        htmlContainer: 'swal-custom-html',
        confirmButton: 'swal-custom-confirm',
        cancelButton: 'swal-custom-cancel',
        input: 'swal-custom-textarea'
      },
      preConfirm: () => {
        const approveRadio = document.getElementById('decision-approve') as HTMLInputElement;
        const disapproveRadio = document.getElementById('decision-disapprove') as HTMLInputElement;
        const reason = Swal.getInput()?.value || '';

        if (!approveRadio?.checked && !disapproveRadio?.checked) {
          Swal.showValidationMessage('Please select a decision');
          return false;
        }

        if (!reason.trim()) {
          Swal.showValidationMessage('Please provide a reason for your decision');
          return false;
        }

        return {
          decision: approveRadio?.checked ? 'APPROVE' : 'DISAPPROVE',
          reason: reason.trim()
        };
      }
    });

    if (result.isConfirmed && result.value) {
      return {
        confirmed: true,
        decision: result.value.decision as 'APPROVE' | 'DISAPPROVE',
        reason: result.value.reason
      };
    }

    return {
      confirmed: false,
      decision: null,
      reason: ''
    };
  }

  /**
   * Show a return for correction dialog with required reason
   */
  async returnForCorrectionDialog(
    applicationNumber: string
  ): Promise<{ confirmed: boolean; comments: string }> {
    const result = await Swal.fire({
      title: 'Return for Correction',
      html: `<p>Return application <strong>${applicationNumber}</strong> to the applicant for corrections.</p>
             <p style="color: #6b7280; font-size: 14px; margin-top: 8px;">Please provide clear instructions on what needs to be corrected.</p>`,
      icon: 'warning',
      input: 'textarea',
      inputPlaceholder: 'Enter the reason for return and correction instructions...',
      inputAttributes: {
        'aria-label': 'Correction instructions',
        rows: '4'
      },
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return 'Please provide a reason for returning the application';
        }
        if (value.trim().length < 10) {
          return 'Please provide more detailed instructions (at least 10 characters)';
        }
        return null;
      },
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Return Application',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        htmlContainer: 'swal-custom-html',
        confirmButton: 'swal-custom-confirm',
        cancelButton: 'swal-custom-cancel',
        input: 'swal-custom-textarea'
      }
    });

    return {
      confirmed: result.isConfirmed,
      comments: result.value || ''
    };
  }
}

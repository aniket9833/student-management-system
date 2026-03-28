import Swal from 'sweetalert2';

const baseConfig = {
  customClass: {
    confirmButton: 'btn btn-primary px-4',
    cancelButton: 'btn btn-secondary px-4 ms-2',
    popup: 'rounded-4 shadow-lg',
  },
  buttonsStyling: false,
};

export const alertSuccess = (title, text = '') =>
  Swal.fire({
    ...baseConfig,
    icon: 'success',
    title,
    text,
    timer: 2000,
    showConfirmButton: false,
  });

export const alertError = (title, text = '') =>
  Swal.fire({ ...baseConfig, icon: 'error', title, text });

export const alertConfirm = (title, text = 'This action cannot be undone.') =>
  Swal.fire({
    ...baseConfig,
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  });

import Swal from 'sweetalert2';
import {
  revokeReceipt,
  addReceipt,
  revokeTransaction,
} from '../utils/transactionAction';

export const revokeReceiptButton = async (
  receipt_id: number,
  transaction_id: number,
  reloadTransactions: () => void,
  showError: (message: string) => void,
  showSuccess: (message: string) => void,
) => {
  // Usamos async/await para manejar la promesa
  try {
    const result = await Swal.fire({
      title: 'Esta seguro de revocar?',
      text: 'No podrá revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, revocar',
      cancelButtonText: 'No, cancelar',
    });

    if (result.isConfirmed) {
      revokeReceipt(
        receipt_id,
        transaction_id,
        reloadTransactions,
        showError,
        showSuccess,
      );
    }
  } catch (error) {
    showError(error instanceof Error ? error.message : String(error));
  }
};

export const revokeTransactionButton = async (
  transaction_id: number,
  reloadTransactions: () => void,
  showError: (message: string) => void,
  showSuccess: (message: string) => void,
) => {
  // Usamos async/await para manejar la promesa
  try {
    const result = await Swal.fire({
      title: 'Esta seguro de revocar?',
      text: 'No podrá revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, revocar',
      cancelButtonText: 'No, cancelar',
    });

    if (result.isConfirmed) {
      revokeTransaction(
        transaction_id,
        reloadTransactions,
        showError,
        showSuccess,
      );
    }
  } catch (error) {
    showError(error instanceof Error ? error.message : String(error));
  }
};

export const addReceiptButton = async (
  transaction_id: number,
  reloadTransactions: () => void,
  showError: (message: string) => void,
  showSuccess: (message: string) => void,
) => {
  try {
    await Swal.fire({
      title: 'Agregar Recibo',
      html: `
          <input id="swal-no" class="swal2-input" type="number" min="0" placeholder="Numero de recibo">
          <input id="swal-amount" class="swal2-input" type="number" min="0" placeholder="Monto del recibo">
          <input id="swal-payer" class="swal2-input" type="text" placeholder="Pagado por">
          <input id="swal-remarks" class="swal2-input" type="text" placeholder="Concepto">
        `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      didOpen: () => {
        document.getElementById('swal-recibo')?.focus();
      },
      preConfirm: () => {
        const no = (
          document.getElementById('swal-no') as HTMLInputElement
        )?.value.trim();
        const amount = (
          document.getElementById('swal-amount') as HTMLInputElement
        )?.value.trim();
        const payer = (
          document.getElementById('swal-payer') as HTMLInputElement
        )?.value.trim();
        const remarks = (
          document.getElementById('swal-remarks') as HTMLInputElement
        )?.value.trim();

        if (!no || !amount) {
          Swal.showValidationMessage('Ambos campos son obligatorios');
          return false;
        }

        const montoNumber = parseFloat(amount);
        if (isNaN(montoNumber) || montoNumber <= 0) {
          Swal.showValidationMessage(
            'El monto debe ser un número válido mayor que 0',
          );
          return false;
        }

        return { no, amount, payer, remarks };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        addReceipt(
          transaction_id,
          parseInt(result.value.no),
          parseFloat(result.value.amount),
          result.value.payer,
          result.value.remarks,
          reloadTransactions,
          showError,
          showSuccess,
        );
      }
    });
  } catch (error) {
    showError(error instanceof Error ? error.message : String(error));
  }
};

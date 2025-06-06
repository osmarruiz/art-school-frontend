import Swal from 'sweetalert2';
import {
  revokeReceipt,
  addReceipt,
  revokeTransaction,
} from '../../utils/transactionActionApi';
import { API_KEY, API_URL } from '../../utils/apiConfig';
import { Fee } from '../../types/fee';

export const revokeReceiptButton = async (
  receipt_id: number,
  transaction_id: number,
  reloadTransactions: () => void,
  showError: (message: string) => void,
  showSuccess: (message: string) => void,
  navigate?: () => void,
) => {
  try {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      html: `
      <p>La acción de revocar un recibo no se puede revertir.</p>
      </br>
      <p>Escribe la palabra <b><code>revocar</code></b> para proceder con esta operación.</p>
      `,
      icon: 'warning',
      input: 'text',
      showCancelButton: true,
      customClass: {
        popup: 'bg-white text-black dark:bg-boxdark-2 dark:text-white',
        confirmButton: 'bg-blue-500 text-white dark:bg-boxdark dark:text-white',
        cancelButton: 'bg-gray-300 text-black dark:bg-gray-700 dark:text-white',
      },
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      if (result.value === 'revocar') {
        revokeReceipt(
          receipt_id,
          transaction_id,
          reloadTransactions,
          showError,
          showSuccess,
          navigate,
        );
      } else {
        Swal.fire({
          title: 'Recibo no revocado.',
          icon: 'info',
          customClass: {
            popup: 'bg-white text-black dark:bg-boxdark-2 dark:text-white',
            confirmButton:
              'bg-blue-500 text-white dark:bg-boxdark dark:text-white',
            cancelButton:
              'bg-gray-300 text-black dark:bg-gray-700 dark:text-white',
          },
        });
      }
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
  navigate?: () => void,
) => {
  try {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      html: `
      <p>La acción de revocar una transacción no se puede revertir. Al revocar una transacción también serán revocados todos sus recibos.</p>
      <p>Escribe la palabra <b><code>revocar</code></b> para proceder con esta operación.</p>
      `,
      icon: 'warning',
      input: 'text',
      showCancelButton: true,
      customClass: {
        popup: 'bg-white text-black dark:bg-boxdark-2 dark:text-white',
        confirmButton: 'bg-blue-500 text-white dark:bg-boxdark dark:text-white',
        cancelButton: 'bg-gray-300 text-black dark:bg-gray-700 dark:text-white',
      },
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      if (result.value === 'revocar') {
        revokeTransaction(
          transaction_id,
          reloadTransactions,
          showError,
          showSuccess,
          navigate,
        );
      } else {
        Swal.fire({
          title: 'Transacción no revocada.',
          icon: 'info',
          customClass: {
            popup: 'bg-white text-black dark:bg-boxdark-2 dark:text-white',
            confirmButton:
              'bg-blue-500 text-white dark:bg-boxdark dark:text-white',
            cancelButton:
              'bg-gray-300 text-black dark:bg-gray-700 dark:text-white',
          },
        });
      }
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
    <input id="swal-no" class="swal2-input bg-white text-black dark:bg-boxdark-2 dark:text-white" type="number" min="0" placeholder="Número de recibo">
    <input id="swal-amount" class="swal2-input bg-white text-black dark:bg-boxdark-2 dark:text-white" type="number" min="0" placeholder="Monto del recibo">
    <input id="swal-payer" class="swal2-input bg-white text-black dark:bg-boxdark-2 dark:text-white" type="text" placeholder="Pagado por (opcional)">
    <input id="swal-remarks" class="swal2-input bg-white text-black dark:bg-boxdark-2 dark:text-white" type="text" placeholder="Concepto (opcional)">
  `,
      focusConfirm: false,
      showCancelButton: true,
      customClass: {
        popup: 'bg-white text-black dark:bg-boxdark-2 dark:text-white',
        confirmButton: 'bg-blue-500 text-white dark:bg-boxdark dark:text-white',
        cancelButton: 'bg-gray-300 text-black dark:bg-gray-700 dark:text-white',
      },
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
          Swal.showValidationMessage(
            'Número de recibo y monto son campos obligatorios.',
          );
          return false;
        }

        const montoNumber = parseFloat(amount);
        if (isNaN(montoNumber) || montoNumber <= 0) {
          Swal.showValidationMessage(
            'El monto debe ser un número válido mayor que 0.',
          );
          return false;
        }

        return { no, amount, payer, remarks };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
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

export const addTransactionButton = async (
  student_id: number,
  reloadTransactions: () => void,
  showError: (message: string) => void,
  showSuccess: (message: string) => void,
) => {
  try {
    let fees: Fee[] = [];

    const cachedFees = sessionStorage.getItem('fees');

    if (cachedFees) {
      fees = JSON.parse(cachedFees);
    } else {
      const feeList = await fetch(`${API_URL}/transactions.fees.list`, {
        headers: { Authorization: API_KEY },
        credentials: 'include',
      });
      fees = await feeList.json();
      sessionStorage.setItem('fees', JSON.stringify(fees));
    }
    const feeOptions = fees
      .filter((fee: Fee) => fee.type !== 'renewal')
      .map(
        (fee: Fee) =>
          `<option value="${fee.id}" data-type="${fee.type}">${fee.label}</option>`,
      )
      .join('');

    await Swal.fire({
      title: 'Agregar Transacción',
      html: `
        <select id="swal-fee" class="bg-white text-black dark:bg-boxdark-2 dark:text-white  w-67 h-[2.625em] px-5 py-3  transition-shadow border border-gray-300 rounded  shadow-inner text-inherit text-lg mt-4 mx-8 mb-1">
          <option value="" disabled selected>Selecciona una tarifa</option>
          ${feeOptions}
        </select>
        <input id="swal-date" class="bg-white text-black dark:bg-boxdark-2 dark:text-white w-67 h-[2.625em] px-5 py-3  transition-shadow border border-gray-300 rounded  shadow-inner text-inherit text-lg mt-4 mx-8 mb-1" type="date" placeholder="Fecha objetivo">
        <input id="swal-amount" class="bg-white text-black dark:bg-boxdark-2 dark:text-white w-67 h-[2.625em] px-5 py-3  transition-shadow border border-gray-300 rounded  shadow-inner text-inherit text-lg mt-4 mx-8 mb-1" type="number" min="0" placeholder="Monto a pagar (opcional)">
        <input id="swal-remarks" class="bg-white text-black dark:bg-boxdark-2 dark:text-white w-67 h-[2.625em] px-5 py-3  transition-shadow border border-gray-300 rounded  shadow-inner text-inherit text-lg mt-4 mx-8 mb-1" type="text" placeholder="Concepto (opcional)">
      `,
      focusConfirm: false,
      showCancelButton: true,
      customClass: {
        popup: 'bg-white text-black dark:bg-boxdark-2 dark:text-white',
        confirmButton: 'bg-blue-500 text-white dark:bg-boxdark dark:text-white',
        cancelButton: 'bg-gray-300 text-black dark:bg-gray-700 dark:text-white',
      },
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      didOpen: () => {
        document.getElementById('swal-fee')?.focus();
        Swal.showValidationMessage(
          'Al omitir el monto, se extraerá de la tarifa seleccionada.',
        );
      },
      preConfirm: () => {
        const fee = (
          document.getElementById('swal-fee') as HTMLInputElement
        )?.value.trim();
        const amount = (
          document.getElementById('swal-amount') as HTMLInputElement
        )?.value.trim();
        const remarks = (
          document.getElementById('swal-remarks') as HTMLInputElement
        )?.value.trim();
        const target_date = (
          document.getElementById('swal-date') as HTMLInputElement
        )?.value.trim();

        let seed_total = false;
        if (!amount) {
          seed_total = true;
        }

        if (!fee) {
          Swal.showValidationMessage('Debes seleccionar una tarifa.');
          return false;
        }

        if (!target_date) {
          Swal.showValidationMessage(
            'Debes seleccionar una fecha para la transacción.',
          );
          return false;
        }

        return { fee, amount, remarks, target_date, seed_total };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        const { fee, amount, remarks, target_date, seed_total } = result.value;

        const transactionData: Record<string, any> = {
          student_id,
          fee_id: parseInt(fee, 10),
          target_date: target_date,
          remarks: remarks,
          total: parseFloat(amount),
          seed_total: seed_total,
        };

        try {
          const response = await fetch(`${API_URL}/transactions.begin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: API_KEY,
            },
            credentials: 'include',
            body: JSON.stringify(transactionData),
          });

          let data = null;
          try {
            if (
              response.headers.get('Content-Type')?.includes('application/json')
            ) {
              data = await response.json();
            }
          } catch (error) {
            console.error('Error al analizar JSON:', error);
          }

          if (!response.ok) {
            showError(data?.detail || 'Error inesperado');
            return;
          }
          showSuccess('Transacción agregada con éxito');
          reloadTransactions();
        } catch (error) {
          showError(error instanceof Error ? error.message : String(error));
        }
      }
    });
  } catch (error) {
    showError(error instanceof Error ? error.message : String(error));
  }
};

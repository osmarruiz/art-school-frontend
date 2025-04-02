import { API_URL, API_KEY } from "./apiConfig";

// Función para revocar un recibo
export const revokeReceipt = async (
  receipt_id: number,
  transaction_id: number,
  reloadTransactions: () => void,
  showError: (message: string) => void,
  showSuccess: (message: string) => void,
) => {
  try {
    const response = await fetch(`${API_URL}/transactions.revoke_receipt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: API_KEY,
      },
      credentials: 'include',
      body: JSON.stringify({
        transaction_id,
        receipt_id,
      }),
    });

    let data = null;
    if (response.headers.get('Content-Type')?.includes('application/json')) {
      data = await response.json();
    }

    if (response.status === 409 ) {
      showError(data?.detail);
      return;
    }

    if (!response.ok) {
      
      throw new Error(`Error HTTP: ${response.status}`);
      
    }

    showSuccess('Recibo revocado con éxito');
    reloadTransactions();
  } catch (error) {
    showError(error instanceof Error ? error.message : String(error));
  }
};

// Función para agregar un recibo
export const addReceipt = async (
  transaction_id: number,
  no: number,
  amount: number,
  payer: string,
  remarks: string,
  reloadTransactions: () => void,
  showError: (message: string) => void,
  showSuccess: (message: string) => void,
) => {
  try {
    const response = await fetch(`${API_URL}/transactions.add_receipt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: API_KEY,
      },
      credentials: 'include',
      body: JSON.stringify({
        transaction_id,
        receipt: {
          no,
          amount,
          payer,
          remarks,
        },
      }),
    });

    let data = null;
    if (response.headers.get('Content-Type')?.includes('application/json')) {
      data = await response.json();
    }

    if (response.status === 409 || response.status === 422) {
      showError(data?.detail);
      return;
    }

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    showSuccess('Recibo agregado con éxito');
    reloadTransactions();
  } catch (error) {
    showError(error instanceof Error ? error.message : String(error));
  }
};

// Función para finalizar los recibos
export const finishTransaction = async (
  transaction_id: number,
  reloadTransactions: () => void,
  showError: (message: string) => void,
  showSuccess: (message: string) => void,
) => {
  try {
    const response = await fetch(`${API_URL}/transactions.finish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: API_KEY,
      },
      credentials: 'include',
      body: JSON.stringify({
        transaction_id,
      }),
    });

    let data = null;
    if (response.headers.get('Content-Type')?.includes('application/json')) {
      data = await response.json();
    }

    if (response.status === 202) {
      showError(data?.detail);
      return;
    }

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    showSuccess('Transacción finalizada con éxito');
    reloadTransactions();
  } catch (error) {
    showError(error instanceof Error ? error.message : String(error));
  }
};

// Función para revocar una transacción
export const revokeTransaction = async (
  transaction_id: number,
  reloadTransactions: () => void,
  showError: (message: string) => void,
  showSuccess: (message: string) => void,
) => {
  try {
    const response = await fetch(`${API_URL}/transactions.revoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: API_KEY,
      },
      credentials: 'include',
      body: JSON.stringify({
        transaction_id,
      }),
    });

    let data = null;
    if (response.headers.get('Content-Type')?.includes('application/json')) {
      data = await response.json();
    }

    if (response.status === 202) {
      showError(data?.detail);
      return;
    }

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    showSuccess('Transacción revocada con éxito');
    reloadTransactions();
  } catch (error) {
    showError(error instanceof Error ? error.message : String(error));
  }
};

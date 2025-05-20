import React, { useEffect, useState, useCallback } from 'react';
import moment from 'moment';
import 'moment/locale/es';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { Transaction } from '../../types/transaction';
import useToast from '../../hooks/useToast';
import { finishTransaction } from '../../utils/transactionActionApi';
import {
  revokeTransactionButton,
  addReceiptButton,
} from '../../components/buttons/TransactionButtons';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import TransactionCard from './TransactionCard';
import ReceiptsTable from './ReceiptsTable';

moment.locale('es');
ModuleRegistry.registerModules([AllCommunityModule]);

interface TransactionListProps {
  transactions: Transaction[];
  reloadTransactions: () => Promise<void>;
  color: 'violet' | 'white' | 'red' | 'orange' | 'green';
}

const LoadingState = () => (
  <div className="flex justify-center items-center p-4">
    <p className="text-lg font-semibold text-gray-500">
      Cargando transacciones...
    </p>
  </div>
);

const EmptyState = () => (
  <p className="text-center text-gray-500">No hay transacciones disponibles.</p>
);

const CardTransaction: React.FC<TransactionListProps> = ({
  transactions,
  reloadTransactions,
  color,
}) => {
  const { showSuccess, showError } = useToast();
  const [visibleReceipts, setVisibleReceipts] = useState<
    Record<string, boolean>
  >({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Handlers
  const toggleVisibility = useCallback((id: number) => {
    setVisibleReceipts((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleViewDetails = useCallback(
    (id: number) => {
      navigate(`/transaction/${id}`);
    },
    [navigate],
  );

  const handleAddReceipt = useCallback(
    async (id: number) => {
      await addReceiptButton(id, reloadTransactions, showError, showSuccess);
    },
    [reloadTransactions, showError, showSuccess],
  );

  const handleFinishTransaction = useCallback(
    async (id: number) => {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción de finalizar una transacción no se puede revertir. Asegúrese que todos los datos están correctos.',
        icon: 'warning',
        showCancelButton: true,
        customClass: {
          popup: 'bg-white text-black dark:bg-boxdark-2 dark:text-white',
          confirmButton:
            'bg-blue-500 text-white dark:bg-boxdark dark:text-white',
          cancelButton:
            'bg-gray-300 text-black dark:bg-gray-700 dark:text-white',
        },
        confirmButtonText: 'Sí, finalizar',
        cancelButtonText: 'No, cancelar',
      });

      if (result.isConfirmed) {
        await finishTransaction(id, reloadTransactions, showError, showSuccess);
      }
    },
    [reloadTransactions, showError, showSuccess],
  );

  const handleRevokeTransaction = useCallback(
    (id: number) => {
      revokeTransactionButton(id, reloadTransactions, showError, showSuccess);
    },
    [reloadTransactions, showError, showSuccess],
  );

  // Column definitions

  const memoizedReload = useCallback(async () => {
    await reloadTransactions();
  }, [reloadTransactions]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await memoizedReload();
      } catch (error) {
        showError('Error al cargar transacciones');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [memoizedReload]);

  if (loading) return <LoadingState />;
  if (transactions.length === 0) return <EmptyState />;

  return (
    <div className="w-full">
      {transactions.map((transaction) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          color={color}
          isVisible={!!visibleReceipts[transaction.id]}
          onToggle={toggleVisibility}
          onViewDetails={handleViewDetails}
          onAddReceipt={handleAddReceipt}
          onFinishTransaction={handleFinishTransaction}
          onRevokeTransaction={handleRevokeTransaction}
        >
          <ReceiptsTable
            receipts={transaction.receipts}
            reloadTransactions={reloadTransactions}
            color={color}
          />
        </TransactionCard>
      ))}
    </div>
  );
};

export default CardTransaction;

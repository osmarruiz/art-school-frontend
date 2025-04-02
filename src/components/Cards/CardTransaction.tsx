import React, { useEffect, useMemo, useRef, useState } from 'react';
import moment from 'moment';
import {
  AllCommunityModule,
  ModuleRegistry,
  colorSchemeLightCold,
  colorSchemeDarkBlue,
  themeQuartz,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import useColorMode from '../../hooks/useColorMode';
import { Transaction } from '../../types/transaction';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FaCheck,
  FaRegTrashCan,
  FaAnglesDown,
  FaPlus,
  FaAnglesUp,
} from 'react-icons/fa6';
import useToast from '../../hooks/useToast';
import { formatCurrency } from '../../utils/formatCurrency';
import { finishTransaction } from '../../utils/transactionAction';
import {
  revokeReceiptButton,
  revokeTransactionButton,
  addReceiptButton,
} from '../../utils/actionButton';
import { colorVariants } from '../../types/colorVariants';
import clsx from 'clsx';

moment.locale('es-us');

ModuleRegistry.registerModules([AllCommunityModule]);
const themeLightCold = themeQuartz.withPart(colorSchemeLightCold);
const themeDarkBlue = themeQuartz.withPart(colorSchemeDarkBlue);

interface TransactionListProps {
  transactions: Transaction[];
  reloadTransactions: () => Promise<void>; // Aseguramos que reloadTransactions devuelva una promesa
  color: 'violet' | 'white' | 'red' | 'orange' | 'green';
}

const CardTransaction: React.FC<TransactionListProps> = ({
  transactions,
  reloadTransactions,
  color,
}) => {
  const { showSuccess, showError } = useToast();
  const gridRef = useRef<AgGridReact<any> | null>(null);
  const [colorMode] = useColorMode();
  const [theme, setTheme] = useState(themeLightCold);
  const [visibleReceipts, setVisibleReceipts] = useState<
    Record<string, boolean>
  >({});
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    setTheme(colorMode === 'dark' ? themeDarkBlue : themeLightCold);
  }, [colorMode]);

  // Cargar transacciones con estado de carga
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        await reloadTransactions(); // Llamar a la función para recargar transacciones
      } catch (error) {
        showError('Error al cargar las transacciones');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [reloadTransactions]);

  const toggleVisibility = (id: number) => {
    setVisibleReceipts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const columnDefs = useMemo(
    () => [
      { field: 'issued_at', headerName: 'Fecha' },
      { field: 'no', headerName: 'Número' },
      { field: 'amount', headerName: 'Monto' },
      { field: 'payer', headerName: 'Pagado Por' },
      { field: 'remarks', headerName: 'Concepto' },
      {
        headerName: 'Acción',
        field: 'action',
        cellRenderer: (params: any) => {
          if (!params.data.is_revoked) {
            return (
              <button
                className={clsx(colorVariants[color].btnSc)}
                onClick={() =>
                  revokeReceiptButton(
                    params.data.id,
                    params.data.transaction_id,
                    reloadTransactions,
                    showError,
                    showSuccess,
                  )
                }
              >
                <FaRegTrashCan />
              </button>
            );
          }
          return <p className='text-red-500'>(Revocado)</p>;
        },
      },
    ],
    [revokeReceiptButton],
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      flex: 1,
      minWidth: 100,
    }),
    [],
  );
  

  return (
    <div className="w-full">
      {loading ? (
        <div className="flex justify-center items-center p-4">
          <p className="text-lg font-semibold text-gray-500">Cargando transacciones...</p>
        </div>
      ) : transactions.length === 0 ? (
        <p className="text-center text-gray-500">No hay transacciones disponibles.</p>
      ) : (
        transactions.map((transaction) => {
          const rowData =
            transaction.receipts?.map((receipt) => ({
              ...receipt,
              transaction_id: transaction.id,
              issued_at: moment(receipt.issued_at).format('LLL'),
              amount: formatCurrency(receipt.amount),
            })) || [];

          return (
            <motion.div
              key={transaction.id}
              animate={{ scale: [0.9, 1] }}
              transition={{ duration: 0.3 }}
              className={clsx(
                'p-4 my-2 rounded-lg w-full',
                colorVariants[color].bg,
              )}
            >
              <div className="flex justify-between items-center">
                <div className={clsx(colorVariants[color].text)}>
                  <div className='block sm:flex gap-2'>
                  <p className="font-bold block xl:inline-flex">{transaction.fee.label}</p>
                  <p>{moment(transaction.target_date).format('LL')}</p>
                  </div>
                  <div className='block sm:flex gap-2'>
                  <p className="font-bold block xl:inline-flex">
                    Total: {formatCurrency(transaction.total)}
                  </p>
                  <p className="font-bold text-orange-500">
                    Saldo: {formatCurrency(transaction.balance)}
                  </p>
                  </div>
                  <p>{(transaction.remarks) ? transaction.remarks : "—"}</p>

                </div>

                {/* Botones de acción */}
                <div className="flex gap-2">
                  <button
                    className={clsx(colorVariants[color].btnSc)}
                    onClick={() =>
                      addReceiptButton(
                        transaction.id,
                        reloadTransactions,
                        showError,
                        showSuccess,
                      )
                    }
                  >
                    <FaPlus size={20} />
                  </button>

                  <button
                    className={clsx(colorVariants[color].btnSc)}
                    onClick={() => toggleVisibility(transaction.id)}
                  >
                    {visibleReceipts[transaction.id] ? (
                      <FaAnglesUp size={20} />
                    ) : (
                      <FaAnglesDown size={20} />
                    )}
                  </button>

                  <button
                    className={clsx(colorVariants[color].btnSc)}
                    onClick={() =>
                      finishTransaction(
                        transaction.id,
                        reloadTransactions,
                        showError,
                        showSuccess,
                      )
                    }
                  >
                    <FaCheck size={20} />
                  </button>

                  <button
                    className={clsx(colorVariants[color].btnSc)}
                    onClick={() =>
                      revokeTransactionButton(
                        transaction.id,
                        reloadTransactions,
                        showError,
                        showSuccess,
                      )
                    }
                  >
                    <FaRegTrashCan size={20} />
                  </button>
                </div>
              </div>

              {/* Tabla de recibos */}
              <AnimatePresence initial={false}>
                {visibleReceipts[transaction.id] && (
                  <motion.div
                    key={`receipts-${transaction.id}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="mt-2"
                    style={{ height: '100%', width: '100%' }}
                  >
                    {rowData.length > 0 ? (
                      <div style={{ height: 250, width: '100%' }}>
                      <AgGridReact
                        ref={gridRef}
                        theme={theme}
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                      />
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No hay recibos disponibles.
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })
      )}
    </div>
  );
};

export default CardTransaction;

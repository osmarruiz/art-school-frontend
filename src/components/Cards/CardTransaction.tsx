import React, { useEffect, useMemo, useRef, useState } from 'react';
import moment from 'moment';
import 'moment/locale/es';
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
import Swal from 'sweetalert2';
import { formatDateFlexible } from '../../utils/formatDateflexible';

moment.locale('es');

ModuleRegistry.registerModules([AllCommunityModule]);
const themeLightCold = themeQuartz.withPart(colorSchemeLightCold);
const themeDarkBlue = themeQuartz.withPart(colorSchemeDarkBlue);

interface TransactionListProps {
  transactions: Transaction[];
  reloadTransactions: () => Promise<void>;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTheme(colorMode === 'dark' ? themeDarkBlue : themeLightCold);
  }, [colorMode]);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        await reloadTransactions();
      } catch (error) {
        showError('Error al cargar las transacciones.');
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
      {
        field: 'issued_at',
        headerName: 'Fecha',
        valueFormatter: (params: { value: any }) =>
          formatDateFlexible(params.value, {
            type: 'date',
            withTimezoneOffset: false,
          }),
      },
      { field: 'no', headerName: 'No. Recibo' },
      { field: 'amount', headerName: 'Monto' },
      {
        field: 'payer',
        headerName: 'Pagado Por',
        valueFormatter: (p: any) => p.value || '—',
      },
      {
        field: 'remarks',
        headerName: 'Concepto',
        valueFormatter: (p: any) => p.value || '—',
      },
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
          return <p className="text-red-500">(Revocado)</p>;
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
          <p className="text-lg font-semibold text-gray-500">
            Cargando transacciones...
          </p>
        </div>
      ) : transactions.length === 0 ? (
        <p className="text-center text-gray-500">
          No hay transacciones disponibles.
        </p>
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
                  <div className="block sm:flex gap-2">
                    <p
                      className={`font-bold block xl:inline-flex text-[${
                        transaction.fee.type === 'enrollment'
                          ? '#4CAF50'
                          : transaction.fee.type === 'month'
                          ? '#FA5A7D'
                          : '#FF947A'
                      }]`}
                    >
                      {transaction.fee.label}
                    </p>
                    <span>•</span>
                    <p>
                      {new Date(
                        transaction.target_date + 'T00:00:00-06:00',
                      ).toLocaleString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="block sm:flex gap-2">
                    <p className="font-bold block xl:inline-flex">
                      Total: {formatCurrency(transaction.total)}
                    </p>
                    <p className="font-bold text-orange-500">
                      Saldo: {formatCurrency(transaction.balance)}
                    </p>
                  </div>
                  <p>{transaction.remarks ? transaction.remarks : '—'}</p>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2">
                  <button
                    title="Agregar un recibo a esta transacción"
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
                    title="Listar los recibos de esta transacción"
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
                    title="Finalizar transacción"
                    className={clsx(colorVariants[color].btnSc)}
                    onClick={async () => {
                      const result = await Swal.fire({
                        title: '¿Estás seguro?',
                        text: 'Esta acción de finalizar una transacción no se puede revertir. Asegúrese que todos los datos están correctos.',
                        icon: 'warning',
                        showCancelButton: true,
                        customClass: {
                          popup:
                            'bg-white text-black dark:bg-boxdark-2 dark:text-white',
                          confirmButton:
                            'bg-blue-500 text-white dark:bg-boxdark dark:text-white',
                          cancelButton:
                            'bg-gray-300 text-black dark:bg-gray-700 dark:text-white',
                        },
                        confirmButtonText: 'Sí, finalizar',
                        cancelButtonText: 'No, cancelar',
                      });

                      if (result.isConfirmed) {
                        finishTransaction(
                          transaction.id,
                          reloadTransactions,
                          showError,
                          showSuccess,
                        );
                      }
                    }}
                  >
                    <FaCheck size={20} />
                  </button>

                  <button
                    title="Revocar transacción"
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

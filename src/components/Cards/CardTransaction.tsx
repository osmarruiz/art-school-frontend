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
import { Toaster } from 'react-hot-toast';
import useToast from '../../hooks/useToast';
import { formatCurrency } from '../../utils/formatCurrency';
import { finishTransaction } from '../../utils/transactionAction';
import {
  revokeReceiptButton,
  revokeTransactionButton,
  addReceiptButton,
} from '../../utils/actionButton';

moment.locale('es');
ModuleRegistry.registerModules([AllCommunityModule]);
const themeLightCold = themeQuartz.withPart(colorSchemeLightCold);
const themeDarkBlue = themeQuartz.withPart(colorSchemeDarkBlue);

interface TransactionListProps {
  transactions: Transaction[];
  reloadTransactions: () => void;
}

const CardTransaction: React.FC<TransactionListProps> = ({
  transactions,
  reloadTransactions,
}) => {
  const { showSuccess, showError } = useToast();
  const gridRef = useRef<AgGridReact<any> | null>(null);
  const [colorMode] = useColorMode();
  const [theme, setTheme] = useState(themeLightCold);
  const [visibleReceipts, setVisibleReceipts] = useState<
    Record<string, boolean>
  >({});

  //botones de acción
  const ActionButton: React.FC<{
    onClick?: () => void;
    children: React.ReactNode;
  }> = ({ onClick, children }) => (
    <button className="text-red-500 hover:text-red-700" onClick={onClick}>
      {children}
    </button>
  );

  const toggleVisibility = (id: number) => {
    setVisibleReceipts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  //Ordena las transacciones por tipo
  const groupedTransactions = useMemo(() => {
    return transactions.reduce<{ [key: string]: Transaction[] }>(
      (acc, transaction) => {
        if (!acc[transaction.fee.type]) acc[transaction.fee.type] = [];
        acc[transaction.fee.type].push(transaction);
        return acc;
      },
      {},
    );
  }, [transactions]);

  //cambio de tema de aggrid
  useEffect(() => {
    setTheme(colorMode === 'dark' ? themeDarkBlue : themeLightCold);
  }, [colorMode]);

  // Columnas de la tabla

  interface ColumnDef {
    field: string;
    headerName: string;
    cellRenderer?: (params: any) => JSX.Element;
  }

  const columnDefs: ColumnDef[] = useMemo(
    () => [
      { field: 'issued_at', headerName: 'Fecha' },
      { field: 'no', headerName: 'Numero' },
      { field: 'amount', headerName: 'Monto' },
      { field: 'payer', headerName: 'Pagado Por' },
      { field: 'remarks', headerName: 'Concepto' },
      {
        headerName: 'Acción',
        field: 'action',
        cellRenderer: (params: any) => (
          <button
            className="text-red hover:text-red-700"
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
        ),
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
      <Toaster position="bottom-right" />
      {Object.entries(groupedTransactions).map(([type, transactions]) => (
        <motion.div
          key={type}
          animate={{ scale: [0.9, 1] }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-boxdark p-4 my-2 rounded-lg w-full"
        >
          {/* Encabezado de tipo de transacción */}
          <h3 className="text-black dark:text-white text-lg font-semibold">
            {type}
          </h3>

          {transactions.map((transaction) => {
            const rowData =
              transaction.receipts?.map((receipt) => ({
                ...receipt,
                transaction_id: transaction.id,
                issued_at: moment(receipt.issued_at).format('LLL'),
                amount: formatCurrency(receipt.amount),
              })) || [];

            return (
              <div key={transaction.id} className=" py-2">
                {/* Información de la transacción */}
                <div className="flex justify-between items-center">
                  <div className="text-black dark:text-white">
                    <p>{moment(transaction.started_at).format('LL')}</p>
                    <p className="font-bold block xl:inline-flex">
                      Total: {formatCurrency(transaction.total)}
                    </p>
                    <p className="font-bold text-orange-500">
                      Saldo: {formatCurrency(transaction.balance)}
                    </p>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-2">
                    <ActionButton
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
                    </ActionButton>

                    <ActionButton
                      onClick={() => toggleVisibility(transaction.id)}
                    >
                      {visibleReceipts[transaction.id] ? (
                        <FaAnglesUp size={20} />
                      ) : (
                        <FaAnglesDown size={20} />
                      )}
                    </ActionButton>

                    <ActionButton
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
                    </ActionButton>

                    <ActionButton>
                      <FaRegTrashCan
                        size={20}
                        onClick={() =>
                          revokeTransactionButton(
                            transaction.id,
                            reloadTransactions,
                            showError,
                            showSuccess,
                          )
                        }
                      />
                    </ActionButton>
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
                      style={{ height: 250, width: '100%' }}
                    >
                      {rowData.length > 0 ? (
                        <AgGridReact
                          ref={gridRef}
                          theme={theme}
                          rowData={rowData}
                          columnDefs={columnDefs}
                          defaultColDef={defaultColDef}
                        />
                      ) : (
                        <p className="text-gray-500 text-sm">
                          No hay recibos disponibles.
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      ))}
    </div>
  );
};

export default CardTransaction;

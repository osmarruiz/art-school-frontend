import { useRef, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Receipt } from '../../types/receipt';
import { formatCurrency } from '../../utils/formatCurrency';
import { useAgGridConfig } from '../../hooks/useAgGridConfig';
import useToast from '../../hooks/useToast';
import { formatDateFlexible } from '../../utils/formatDateflexible';
import ActionButton from './ActionButton';
import { FaRegTrashCan } from 'react-icons/fa6';
import { revokeReceiptButton } from '../../utils/actionButton';
import { ColDef } from 'ag-grid-community';

interface ReceiptsTableProps {
  receipts: Receipt[];
  reloadTransactions: () => Promise<void>;
  color: 'violet' | 'white' | 'red' | 'orange' | 'green';
}

const ReceiptsTable: React.FC<ReceiptsTableProps> = ({
  receipts,
  reloadTransactions,
  color,
}) => {
  const { showSuccess, showError } = useToast();
  const { theme, defaultColDef, localeText } = useAgGridConfig();
  const gridRef = useRef<AgGridReact<Receipt>>(null);

  const columnDefs: ColDef<Receipt>[] = useMemo(
    () => [
      {
        field: 'issued_at',
        headerName: 'Fecha',
        valueFormatter: ({ value }: { value: string }) =>
          formatDateFlexible(value, {
            type: 'date',
            withTimezoneOffset: false,
          }),
      },
      { field: 'no', headerName: 'No. Recibo' },
      {
        field: 'amount',
        headerName: 'Monto',
        valueFormatter: ({ value }: { value: number }) => formatCurrency(value),
      },
      {
        field: 'payer',
        headerName: 'Pagado Por',
        valueFormatter: ({ value }: { value: string }) => value || 'N/a',
      },
      {
        field: 'remarks',
        headerName: 'Concepto',
        valueFormatter: ({ value }: { value: string }) => value || 'N/a',
      },
      {
        headerName: 'Acción',
        cellRenderer: ({ data }: { data: any }) => {
          if (!data.is_revoked) {
            return (
              <ActionButton
                icon={<FaRegTrashCan />}
                onClick={() =>
                  revokeReceiptButton(
                    data.id,
                    data.transaction_id,
                    reloadTransactions,
                    showError,
                    showSuccess,
                  )
                }
                color={color}
                title="Revocar recibo"
              />
            );
          }
          return <p className="text-red-500">(Revocado)</p>;
        },
      },
    ],
    [color, reloadTransactions, showError, showSuccess],
  );

  return receipts.length > 0 ? (
    <div style={{ height: 250, width: '100%' }}>
      <AgGridReact
        ref={gridRef}
        theme={theme}
        rowData={receipts}
        localeText={localeText}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
      />
    </div>
  ) : (
    <p className="text-gray-500 text-sm">No hay recibos disponibles.</p>
  );
};

export default ReceiptsTable;

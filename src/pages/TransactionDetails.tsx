import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AllCommunityModule,
  ModuleRegistry,
  colorSchemeLightCold,
  colorSchemeDarkBlue,
  themeQuartz,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import useColorMode from '../hooks/useColorMode';
import { useParams } from 'react-router-dom';
import { API_KEY, API_URL } from '../utils/apiConfig';
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import { colorVariants } from '../types/colorVariants';
import clsx from 'clsx';
import { FaArrowLeft, FaRegTrashCan } from 'react-icons/fa6';
import { Transaction } from '../types/transaction';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDateFlexible } from '../utils/formatDateflexible';
import { revokeReceiptButton, revokeTransactionButton } from '../utils/actionButton';
import useToast from '../hooks/useToast';

ModuleRegistry.registerModules([AllCommunityModule]);
const themeLightCold = themeQuartz.withPart(colorSchemeLightCold);
const themeDarkBlue = themeQuartz.withPart(colorSchemeDarkBlue);

interface DataItem {
  label: string;
  value: string | number | React.ReactNode;
}

const TransactionDetails: React.FC = () => {
  const { id } = useParams();
  const [colorMode] = useColorMode();
  const [theme, setTheme] = useState(themeLightCold);
  const [transactionData, setTransactionData] = useState<Transaction>();
  const [receiptsData, setReceiptsData] = useState<Transaction[]>();
  const [loading, setLoading] = useState(true);
  const [txFound, setTxFound] = useState<boolean>(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const fetchStudentInfo = async () => {
      setLoading(true);
      try {
        const headers = {
          credentials: 'include' as RequestCredentials,
          headers: {
            Authorization: `${API_KEY}`,
            'Content-Type': 'application/json',
          },
        };

        const response = await fetch(`${API_URL}/transactions.get?transaction_id=${id}`, headers);

        if (!response.ok) {
          if (response.status === 404) {
            setTxFound(false);
          } else {
          }
          return;
        }

        const txData = await response.json();
        setTransactionData(txData);
        setReceiptsData(txData.receipts);
      } catch (e: any) {
        console.error('Error fetching student data:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentInfo();
  }, [id]);

  const txData: DataItem[] = [
    { label: 'ID', value: transactionData?.id },
    { label: 'Fecha seleccionada', value: formatDateFlexible(transactionData?.target_date + "T00:00:00-06:00", { type: 'date', withTimezoneOffset: true }) },
    { label: 'Total a pagar', value: formatCurrency(Number(transactionData?.total)) },
    { label: 'Saldo', value: formatCurrency(Number(transactionData?.balance)) },
    { label: '¿Revocada?', value: `${transactionData?.is_revoked ? 'Sí' : 'No'}` },
    { label: '¿Pagada?', value: `${transactionData?.is_paid ? 'Sí' : 'No'}` },
    { label: '¿Finalizada?', value: `${transactionData?.is_finished ? 'Sí' : 'No'}` },
    { label: 'Fecha de inicio', value: formatDateFlexible(transactionData?.started_at + "", { type: "datetime", withTimezoneOffset: true }) },
    {
      label: 'Fecha de finalización', value: !!transactionData?.finished_at
        && formatDateFlexible(transactionData?.finished_at + "", { type: "datetime", withTimezoneOffset: true })
        || "N/a"
    },
    { label: 'Concepto', value: transactionData?.remarks || "N/a" },
  ];

  const txTypeData: DataItem[] = [
    { label: 'ID', value: transactionData?.fee.id },
    { label: 'Tipo', value: transactionData?.fee.label },
    { label: 'Descripción', value: transactionData?.fee.description },
  ];

  useEffect(() => {
    setTheme(colorMode === 'dark' ? themeDarkBlue : themeLightCold);
  }, [colorMode]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,

      flex: 1,
      minWidth: 100,
    }),
    [],
  );

  const finalizedGridRef = useRef<AgGridReact<Transaction>>(null);
  const finalizedColumnDefs = useMemo(
    () => [
      { field: 'id', headerName: 'ID' },
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
      { field: 'amount', headerName: 'Monto', valueFormatter: (params) => formatCurrency(params.value) },
      {
        field: 'payer',
        headerName: 'Pagado Por',
        valueFormatter: (p: any) => p.value || 'N/a',
      },
      {
        field: 'remarks',
        headerName: 'Concepto',
        valueFormatter: (p: any) => p.value || 'N/a',
      },
      {
        headerName: 'Acción',
        field: 'action',
        cellRenderer: (params: any) => {
          if (transactionData?.is_paid || transactionData?.is_finished) {
            return <p className="text-green-500">(N/a)</p>;
          }

          if (!params.data.is_revoked) {
            return (
              <button
                className={clsx(colorVariants["red"].btnSc)}
                onClick={() => {
                  revokeReceiptButton(
                    params.data.id,
                    Number(id),
                    () => null,
                    showError,
                    showSuccess,
                    () => navigate(`/transaction/${Number(id)}`),
                  );
                }}
              >
                <FaRegTrashCan />
              </button>
            );
          }

          return <p className="text-red-500">(Revocado)</p>;
        },
      },
    ],
    [revokeReceiptButton, transactionData],
  );

  if (!txFound) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-red-600 mb-4">
            Transacción no encontrada
          </h2>
          <p className="text-lg text-gray-600">
            No se encontró ninguna transacción con la ID proporcionado.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={clsx(' p-12 rounded-xl', colorVariants['white'].bg)}>
        <p className={clsx('text-center', colorVariants['white'].text)}>
          Cargando datos de la transacción...
        </p>
      </div>
    );
  }

  return (
    <div className={clsx(' w-full p-12 rounded-xl', colorVariants['white'].bg)} >
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-1">
          <div
            className={clsx(
              'flex h-8.5 w-8.5 items-center justify-center rounded-full hover:cursor-pointer',
              colorVariants['white'].btn,
            )}
            onClick={() => {
              navigate(-1);
            }}
          >
            <FaArrowLeft size={20} />
          </div>
          {!transactionData?.is_finished && !transactionData?.is_paid && !transactionData?.is_revoked && user?.role === 'admin' || user?.role === 'operator' ? (
            <div>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline me-3"
                onClick={() => {
                  revokeTransactionButton(
                    Number(id),
                    () => null,
                    showError,
                    showSuccess,
                    () => navigate(`/transaction/${Number(id)}`),
                  )
                }}
              >
                Revocar transacción
              </button>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div
          className={clsx(
            'shadow rounded-md p-6',
            colorVariants['white'].icon,
          )}
        >
          <h3 className="text-2xl font-semibold mb-4">Detalles de la transacción</h3>
          {txData.map((item) => (
            <div
              key={item.label}
              className="grid grid-cols-2 gap-y-4 text-lg"
            >
              <dt className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                {item.label}
              </dt>
              <dd className="text-gray-600 dark:text-gray-400">
                {item.value}
              </dd>
            </div>
          ))}
        </div>

        <div
          className={clsx(
            'shadow rounded-md p-6',
            colorVariants['white'].icon,
          )}
        >
          <h3 className="text-2xl font-semibold mb-4">Tarifa</h3>
          {txTypeData.map((item) => (
            <div
              key={item.label}
              className="grid grid-cols-2 gap-y-4 text-lg"
            >
              <dt className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                {item.label}
              </dt>
              <dd className="text-gray-600 dark:text-gray-400">
                {item.value}
              </dd>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-2">
          Recibos ({receiptsData?.length})
        </h3>
        <div className="w-full h-125">
          <AgGridReact
            ref={finalizedGridRef}
            rowData={receiptsData}
            theme={theme}
            columnDefs={finalizedColumnDefs}
            defaultColDef={defaultColDef}
            rowSelection="single"
          />
        </div>
      </div>
    </div>
  );

};

export default TransactionDetails;

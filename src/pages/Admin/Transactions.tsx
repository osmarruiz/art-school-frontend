import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AllCommunityModule,
  ModuleRegistry,
  colorSchemeLightCold,
  colorSchemeDarkBlue,
  themeQuartz,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import useColorMode from '../../hooks/useColorMode';
import { FaDollarSign, FaMoneyBillWave } from 'react-icons/fa6';
import CardDataStats from '../../components/Cards/CardDataStats';
import { Transaction } from '../../types/transaction';
import { API_KEY, API_URL } from '../../utils/apiConfig';
import { Aggregate } from '../../types/aggregate';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateFlexible } from '../../utils/formatDateflexible';

ModuleRegistry.registerModules([AllCommunityModule]);
const themeLightCold = themeQuartz.withPart(colorSchemeLightCold);
const themeDarkBlue = themeQuartz.withPart(colorSchemeDarkBlue);

const Transactions: React.FC = () => {
  const [colorMode] = useColorMode();
  const gridRef = useRef<AgGridReact<any> | null>(null);
  const [theme, setTheme] = useState(themeLightCold);
  const [rowData, setRowData] = useState<Aggregate>();
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterParam, setFilterParam] = useState<string>('');

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${API_URL}/transactions.aggregate?rpp=99999999${filterParam}`,
        {
          headers: {
            Authorization: API_KEY,
          },
          credentials: 'include',
        },
      );

      const data = await response.json();
      setRowData({ ...data, payload: [...data.payload] });
    } catch (error) {
      console.error('Error al obtener datos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterParam]);

  useEffect(() => {
    setTheme(colorMode === 'dark' ? themeDarkBlue : themeLightCold);
  }, [colorMode]);

  const columnDefs = useMemo(
    () => [
      { field: 'student.name', headerName: 'Estudiante' },
      { field: 'fee.label', headerName: 'Tipo' },
      {
        field: 'total',
        headerName: 'Total a pagar',
        valueGetter: (params: any) => formatCurrency(params.data.total),
      },
      {
        field: 'balance',
        headerName: 'Saldo',
        valueGetter: (params: any) => formatCurrency(params.data.balance),
      },
      {
        field: 'target_date',
        headerName: 'Fec. selec.',
        flex: 2,
        valueFormatter: (params: { value: any }) =>
          formatDateFlexible(params.value, {
            type: 'date',
            withTimezoneOffset: true,
          }),
      },
      {
        field: 'remarks',
        headerName: 'Concepto',
        flex: 2,
        valueFormatter: (params: { value: any }) =>
          ((v) => (!v ? '—' : v))(params.value),
      },
      { field: 'is_finished', headerName: '¿Finalizada?' },
      { field: 'is_revoked', headerName: '¿Revocada?' },
      { field: 'is_paid', headerName: '¿Pagada?' },
    ],
    [],
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

  const filteredData = useMemo(() => {
    return (
      rowData?.payload?.filter((item: Transaction) => {
        const valuesToSearch = [
          item.student?.name ?? '',
          item.fee?.label ?? '',
        ];

        return valuesToSearch.some((value) =>
          value.toLowerCase().includes(searchText.toLowerCase()),
        );
      }) ?? []
    );
  }, [rowData, searchText]);

  return (
    <>
      <div className="w-full flex flex-col xxl:flex-row xxl:items-center xxl:justify-between gap-y-4 gap-x-6 text-sm sm:text-base mb-4 sm:mb-6">
        {/* Título */}
        <div className="w-full xxl:w-1/5 flex justify-center xxl:justify-start">
          <h1 className="text-title-md xxl:text-title-md2 font-bold text-black dark:text-white">
            Transacciones
          </h1>
        </div>

        {/* Barra de búsqueda */}
        <div className="w-full xxl:w-1/2 flex justify-center">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Buscar transacción (nombre, tipo)"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full h-12 bg-white pl-10 pr-4 text-black focus:outline-none rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-300"
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="w-full xxl:w-1/5 flex justify-center xxl:justify-end  gap-4 xxl:gap-1">
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-400">
            <input
              type="radio"
              name="filter"
              value=""
              checked={filterParam === ''}
              onChange={() => setFilterParam('')}
              className="form-radio h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
            />
            Pendientes
          </label>

          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-400">
            <input
              type="radio"
              name="filter"
              value="&revoked=true"
              checked={filterParam === '&revoked=true'}
              onChange={() => setFilterParam('&revoked=true')}
              className="form-radio h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
            />
            Revocadas
          </label>

          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-400">
            <input
              type="radio"
              name="filter"
              value="&paid=true"
              checked={filterParam === '&paid=true'}
              onChange={() => setFilterParam('&paid=true')}
              className="form-radio h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
            />
            Finalizadas
          </label>
        </div>
      </div>

      <div className="h-125 w-full">
        <AgGridReact
          ref={gridRef}
          theme={theme}
          loading={loading}
          rowData={filteredData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowHeight={75}
        />
      </div>
      <div className="sm:flex justify-end gap-4 md:gap-6 my-6">
        <div className="sm:w-1/2 xl:w-1/4 mb-4">
          <CardDataStats
            title="Total transacciones finalizadas"
            total={rowData?.statistics.total_transactions_finished?.toString()}
          >
            <FaDollarSign className="fill-success dark:fill-white" size={20} />
          </CardDataStats>
        </div>
        <div className="sm:w-1/2 xl:w-1/4 mb-4">
          <CardDataStats
            title="Total transacciones pagadas"
            total={rowData?.statistics.total_transactions_paid?.toString()}
          >
            <FaMoneyBillWave
              className="fill-primary dark:fill-white"
              size={20}
            />
          </CardDataStats>
        </div>
        <div className="sm:w-1/2 xl:w-1/4 mb-4">
          <CardDataStats
            title="Total transacciones revocadas"
            total={rowData?.statistics.total_transactions_revoked?.toString()}
          >
            <FaMoneyBillWave
              className="fill-danger dark:fill-white"
              size={20}
            />
          </CardDataStats>
        </div>
        <div className="sm:w-1/2 xl:w-1/4 mb-4">
          <CardDataStats
            title="Total transacciones"
            total={rowData?.statistics.total_transactions?.toString()}
          >
            <FaMoneyBillWave
              className="fill-primary dark:fill-white"
              size={20}
            />
          </CardDataStats>
        </div>
      </div>
    </>
  );
};

export default Transactions;

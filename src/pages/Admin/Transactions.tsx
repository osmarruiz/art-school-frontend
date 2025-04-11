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
import clsx from 'clsx';
import { FaSearch } from 'react-icons/fa';
import CardDataStats from '../../components/Cards/CardDataStats';
import { colorVariants } from '../../types/colorVariants';
import { Transaction } from '../../types/transaction';
import { API_KEY, API_URL } from '../../utils/apiConfig';
import { Aggregate } from '../../types/aggregate';
import { formatCurrency } from '../../utils/formatCurrency';

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

  //cambia el tema del aggrid segun el estado de colorMode
  useEffect(() => {
    setTheme(colorMode === 'dark' ? themeDarkBlue : themeLightCold);
  }, [colorMode]);

  // Definición de columnas con tipado correcto

  const formatShortDate = (value: number) => {
    if (!value) {
      return '—';
    }
    const date = new Date(value + "T00:00:00-06:00");
 return date.toLocaleDateString('es-NI');
  };


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
      { field: 'target_date', headerName: 'Fec. selec.', valueFormatter: (params) => formatShortDate(params.value) },
      { field: 'remarks', headerName: 'Concepto', flex: 2, valueFormatter: (params) => (v => !v ? "—" : v)(params.value) },
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
    return rowData?.payload?.filter((item: Transaction) => {
      const valuesToSearch = [
        item.id?.toString() ?? '',
        item.student?.name ?? '',
        item.fee?.label ?? '',
        item.remarks ?? '',
        item.target_date?.toString() ?? '',
      ];
  
      return valuesToSearch.some((value) =>
        value.toLowerCase().includes(searchText.toLowerCase())
      );
    }) ?? [];
  }, [rowData, searchText]);

  return (
    <>
      <div className="block sm:flex justify-between items-center gap-4 text">
        <div className="flex justify-center sm:justify-start  sm:w-1/5 mb-4 sm:mb-6">
          <h1 className="text-title-md xl:text-title-md2 font-bold text-black dark:text-white">
            Transacciones
          </h1>
        </div>

        <div className="flex justify-center sm:w-3/5  mb-4 sm:mb-6">
          <div
            className={clsx('relative w-full e', colorVariants['white'].text)}
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch size={16} />
            </span>
            <input
              type="text"
              placeholder="Buscar transaccion"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className={clsx(
                'w-125 h-12 bg-white pl-9 pr-4 text-black focus:outline-none rounded-lg shadow-default',
                colorVariants['white'].inp,
              )}
            />
          </div>
        </div>
        <div className="flex justify-center sm:justify-end gap-4 sm:w-1/5  mb-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="filter"
              value=""
              checked={filterParam === ''}
              onChange={() => setFilterParam('')}
            />
            Pendientes
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="filter"
              value="&revoked=true"
              checked={filterParam === '&revoked=true'}
              onChange={() => setFilterParam('&revoked=true')}
            />
            Revocadas
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="filter"
              value="&paid=true"
              checked={filterParam === '&paid=true'}
              onChange={() => setFilterParam('&paid=true')}
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
            title="Total trasacciones finalizadas"
            total={rowData?.statistics.total_transactions_finished?.toString()}
          >
            <FaDollarSign
              className="fill-success dark:fill-white"
              size={20}
            />
          </CardDataStats>
        </div>
        <div className="sm:w-1/2 xl:w-1/4 mb-4">
          <CardDataStats
            title="Total trasacciones pagadas"
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
            title="Total trasacciones revocadas"
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

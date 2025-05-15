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
import { FaArrowRight, FaMoneyBillWave } from 'react-icons/fa6';
import clsx from 'clsx';
import { FaSearch, FaBell } from 'react-icons/fa';
import CardDataStats from '../../components/Cards/CardDataStats';
import { colorVariants } from '../../types/colorVariants';
import { API_KEY, API_URL } from '../../utils/apiConfig';
import { PendingAggregate } from '../../types/pendingAggregate';
import { formatCurrency } from '../../utils/formatCurrency';
import { useNavigate } from 'react-router-dom';
import { formatDateFlexible } from '../../utils/formatDateflexible';
import { useAuth } from '../../utils/AuthContext';

ModuleRegistry.registerModules([AllCommunityModule]);
const themeLightCold = themeQuartz.withPart(colorSchemeLightCold);
const themeDarkBlue = themeQuartz.withPart(colorSchemeDarkBlue);

const Pendings: React.FC = () => {
  const [colorMode] = useColorMode();
  const gridRef = useRef<AgGridReact<any> | null>(null);
  const [theme, setTheme] = useState(themeLightCold);
  const [rowData, setRowData] = useState<PendingAggregate>();
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${API_URL}/transactions.pending.aggregate?rpp=9999999`,
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

  const filteredData = useMemo(() => {
    return (
      rowData?.payload?.filter((item) => {
        const valuesToSearch = [item.student.name ?? ''];

        return valuesToSearch.some((value) =>
          value.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").includes(searchText.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ")),
        );
      }) || []
    );
  }, [rowData, searchText]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setTheme(colorMode === 'dark' ? themeDarkBlue : themeLightCold);
  }, [colorMode]);

  const opcionesRenderer = (params: any) => {
    return (
      <div className="flex gap-4 mt-1 justify-center ">
        <button
          className={clsx(colorVariants['white'].btnSc)}
          onClick={() => navigate(`/student/${params.data.student.id}`)}
        >
          <FaArrowRight size={20} />
        </button>
        {user?.role === 'admin' && (
          <button className={clsx(colorVariants['white'].btnSc)} hidden>
            <FaBell size={20} />
          </button>
        )}
      </div>
    );
  };

 const localeText = {
  loadingOoo: 'Cargando...',
  noRowsToShow: 'No hay filas para mostrar',
  page: 'Página',
  of: 'de',
  next: 'Siguiente',
  previous: 'Anterior',
  filterOoo: 'Filtrando...',
  applyFilter: 'Aplicar filtro',
  resetFilter: 'Reiniciar filtro',
  searchOoo: 'Buscando...',
};

  const columnDefs = useMemo(
    () => [
      { field: 'student.name', headerName: 'Estudiante' },
      { field: 'total_transactions', headerName: 'Cant. transacciones pte.' },
      {
        field: 'balance_sum',
        headerName: 'Saldo total pte.',
        valueGetter: (params: any) => formatCurrency(params.data.balance_sum),
      },
      {
        field: 'balance_avg',
        headerName: 'Saldo promedio pte.',
        valueGetter: (params: any) => formatCurrency(params.data.balance_avg),
      },
      {
        field: 'min_due_date',
        headerName: 'Mes mín. pte.',
        valueFormatter: (params: any) =>
          formatDateFlexible(new Date(params.value + "T00:00:00-06:00").toString(), {
            type: 'month-year',
            withTimezoneOffset: true,
          }),
      },

      {
        field: 'max_due_date',
        headerName: 'Mes máx. pte.',
        valueFormatter: (params: any) =>
          formatDateFlexible(new Date(params.value + "T00:00:00-06:00").toString(), {
            type: 'month-year',
            withTimezoneOffset: true,
          }),
      },
      {
        field: 'opciones',
        headerName: 'Opciones',
        cellRenderer: opcionesRenderer,
      },
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

  return (
    <>
      <div className="block sm:flex justify-between items-center gap-4 text">
        <div className="flex justify-center sm:justify-start  sm:w-1/5 mb-4 sm:mb-6">
          <h1 className="text-title-md xl:text-title-md2 font-bold text-black dark:text-white">
            Pendientes
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
              placeholder="Buscar pendiente (estudiante)"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className={clsx(
                'w-full h-12 bg-white pl-9 pr-4 text-black focus:outline-none rounded-lg shadow-default',
                colorVariants['white'].inp,
              )}
            />
          </div>
        </div>
        {user?.role === 'admin' && (
          <div className="justify-center sm:justify-end gap-4 sm:w-1/5  mb-6 hidden">
            <button
              className={clsx(
                'inline-flex items-center justify-center py-2.5 px-3 ',
                colorVariants['white'].btn,
              )}
            >
              Notificar a todos
            </button>
          </div>
        )}
      </div>
      <div className="h-125 w-full">
        <AgGridReact
          ref={gridRef}
          theme={theme}
          loading={loading}
          localeText={localeText}
          rowData={filteredData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
        />
      </div>
      <div className="sm:flex justify-end gap-4 md:gap-6 my-6">
        <div className="sm:w-1/2 xl:w-1/4">
          <CardDataStats
            title="Total de pendientes"
            total={rowData?.total_pending.toString() || '0'}
          >
            <FaMoneyBillWave
              className="fill-danger dark:fill-white"
              size={20}
            />
          </CardDataStats>
        </div>
      </div>
    </>
  );
};

export default Pendings;

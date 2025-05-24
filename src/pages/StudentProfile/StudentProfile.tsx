import { useEffect, useMemo, useRef, useState } from 'react';
import { AllCommunityModule, ModuleRegistry, ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useParams } from 'react-router-dom';
import { API_KEY, API_URL } from '../../utils/apiConfig';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { colorVariants } from '../../utils/colorVariants';
import clsx from 'clsx';
import { Student } from '../../types/student';
import { StatusHistory } from '../../types/statusHistory';
import { Transaction } from '../../types/transaction';
import { TransactionsPending } from '../../types/transactionsPending';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateFlexible } from '../../utils/formatDateflexible';
import { useAgGridConfig } from '../../hooks/useAgGridConfig';
import HeaderStudentProfile from './HeaderStudentProfile';
import ListCardsInfo from './ListCardsInfo';

ModuleRegistry.registerModules([AllCommunityModule]);



const StudentProfile: React.FC = () => {
  const { id } = useParams();
  const [studentData, setStudentData] = useState<Student>();
  const [finishedTransactionsData, setFinishedTransactionsData] =
    useState<Transaction[]>();
  const [statusHistoryData, setStatusHistoryData] = useState<StatusHistory[]>(
    [],
  );
  const [pendingTransactionsData, setPendingTransactionsData] =
    useState<TransactionsPending[]>();
  const [loading, setLoading] = useState(true);
  const [studentFound, setStudentFound] = useState<boolean>(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme, defaultColDef, localeText } = useAgGridConfig();

  

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

        const [studentRes, transactionsRes, pendingRes] = await Promise.all([
          fetch(`${API_URL}/students.get?student_id=${id}`, headers),
          fetch(`${API_URL}/transactions.list?student_id=${id}`, headers),
          fetch(
            `${API_URL}/transactions.pending.list?student_id=${id}`,
            headers,
          ),
        ]);

        if (!studentRes.ok) {
          if (studentRes.status === 404) {
            setStudentFound(false);
          } else {
          }
          return;
        }

        const studentProfileData = await studentRes.json();
        const transactionsData = await transactionsRes.json();
        const pendingData = await pendingRes.json();

        setStudentData(studentProfileData);
        setStatusHistoryData(studentProfileData.status_history ?? []);
        setFinishedTransactionsData(transactionsData);
        setPendingTransactionsData(pendingData);
      } catch (e: any) {
        console.error('Error fetching student data:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentInfo();
  }, [id]);
  
  const pendingGridRef = useRef<AgGridReact<TransactionsPending>>(null);
  const finalizedGridRef = useRef<AgGridReact<Transaction>>(null);
  const statusHistoryGridRef = useRef<AgGridReact<StatusHistory>>(null);

  const finalizedColumnDefs: ColDef<Transaction>[] = useMemo(
    () => [
      { field: 'id', headerName: 'ID' },
      {
        headerName: 'Tipo',
        valueGetter: (params) => params.data?.fee.label || '—',
      },
      {
        field: 'total',
        headerName: 'Total',
        valueFormatter: (params) => formatCurrency(params.value),
      },
      {
        field: 'balance',
        headerName: 'Saldo',
        valueFormatter: (params) => formatCurrency(params.value),
      },
      {
        field: 'target_date',
        headerName: 'Fec. selec.',
        valueFormatter: (params) =>
          formatDateFlexible(params.value, {
            type: 'date',
            withTimezoneOffset: true,
          }),
      },
      {
        field: 'started_at',
        headerName: 'Fec. inic.',
        valueFormatter: (params) =>
          formatDateFlexible(params.value, { type: 'datetime', short: true }),
      },
      {
        field: 'finished_at',
        headerName: 'Fec. fina.',
        valueFormatter: (params) =>
          formatDateFlexible(params.value, { type: 'datetime', short: true }),
      },
      {
        field: 'remarks',
        headerName: 'Concepto',
        flex: 2,
        valueFormatter: (params) => params.value || '—',
      },
      { field: 'is_finished', headerName: '¿Finalizada?' },
      { field: 'is_revoked', headerName: '¿Revocada?' },
    ],
    [],
  );

  const pendingColumnDefs: ColDef<TransactionsPending>[] = useMemo(
    () => [
      { field: 'status', headerName: 'Estado' },
      {
        headerName: 'Tipo',
        flex: 1,
        valueGetter: (params) => params.data?.fee?.type || '—',
      },
      {
        field: 'balance',
        headerName: 'Saldo pendiente',
        flex: 1,
        valueFormatter: (params) => formatCurrency(params.value),
      },
      { field: 'year', headerName: 'Año', flex: 1 },
      {
        field: 'date',
        headerName: 'Fecha',
        flex: 1,
        valueFormatter: (params) =>
          formatDateFlexible(params.value, {
            type: 'date',
            withTimezoneOffset: true,
          }),
      },
    ],
    [],
  );

  const statusHistoryColumnDefs: ColDef<StatusHistory>[] = useMemo(
    () => [
      {
        field: 'removed_at',
        headerName: 'Fecha de desactivación',
        valueFormatter: (params) =>
          formatDateFlexible(params.value, { type: 'datetime' }),
      },
      {
        field: 'reason',
        headerName: 'Razón',
        flex: 1,
        valueFormatter: (params) => params.value || '—',
      },
      {
        field: 'recovered_at',
        headerName: 'Fecha de reingreso',
        flex: 1,
        valueFormatter: (params) =>
          formatDateFlexible(params.value, { type: 'datetime' }),
      },
    ],
    [],
  );

  

  if (!studentFound) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-red-600 mb-4">
            Estudiante no encontrado
          </h2>
          <p className="text-lg text-gray-600">
            No se encontró ningún estudiante con el ID proporcionado.
          </p>
        </div>
      </div>
    );
  }

  if (!loading) {
    return (
      <div
        className={clsx(' w-full p-12 rounded-xl', colorVariants['white'].bg)}
      >
        <HeaderStudentProfile
          studentData={studentData!}
          user={user}
          navigate={navigate}
        />

        <ListCardsInfo
          studentData={studentData!}
          navigate={navigate}
          user={user}
          
        />

        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-2">
            Todas las transacciones ({finishedTransactionsData?.length})
          </h3>
          <div className="w-full h-125">
            <AgGridReact
              ref={finalizedGridRef}
              rowData={finishedTransactionsData}
              theme={theme}
              localeText={localeText}
              columnDefs={finalizedColumnDefs}
              defaultColDef={defaultColDef}
              rowSelection="single"
              onRowClicked={(event) => {
                if (event.data) {
                  navigate(`/transaction/${event.data.id}`);
                }
              }}
              rowStyle={{ cursor: 'pointer' }}
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-2 text-red-500">
            Transacciones pendientes ({pendingTransactionsData?.length})
          </h3>
          <div className="w-full h-75">
            <AgGridReact
              ref={pendingGridRef}
              rowData={pendingTransactionsData || []}
              theme={theme}
              localeText={localeText}
              columnDefs={pendingColumnDefs}
              defaultColDef={defaultColDef}
              rowSelection="single"
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-2">
            Historial de desactivaciones ({statusHistoryData.length})
          </h3>
          <div className="w-full h-50">
            <AgGridReact
              ref={statusHistoryGridRef}
              rowData={statusHistoryData}
              theme={theme}
              localeText={localeText}
              columnDefs={statusHistoryColumnDefs}
              defaultColDef={defaultColDef}
              rowSelection="single"
            />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className={clsx(' p-12 rounded-xl', colorVariants['white'].bg)}>
        <p className={clsx('text-center', colorVariants['white'].text)}>
          Cargando datos del estudiante...
        </p>
      </div>
    );
  }
};

export default StudentProfile;

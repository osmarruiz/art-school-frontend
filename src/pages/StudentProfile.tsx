import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AllCommunityModule,
  ModuleRegistry,
  colorSchemeLightCold,
  colorSchemeDarkBlue,
  themeQuartz,
  ColDef,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import useColorMode from '../hooks/useColorMode';
import { useParams } from 'react-router-dom';
import { API_KEY, API_URL } from '../utils/apiConfig';
import Loader from '../common/Loader';
import Swal from 'sweetalert2';
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import { colorVariants } from '../types/colorVariants';
import clsx from 'clsx';
import { FaArrowRight } from 'react-icons/fa6';

ModuleRegistry.registerModules([AllCommunityModule]);
const themeLightCold = themeQuartz.withPart(colorSchemeLightCold);
const themeDarkBlue = themeQuartz.withPart(colorSchemeDarkBlue);

interface DataItem {
  label: string;
  value: string | number | React.ReactNode;
}

interface Transaction {
  id: string;
  alumno: string;
  tarifa: string;
  fecha: string;
  total: string;
}

interface Course {
  course: {
    id: number;
    name: string;
  };
  shift: {
    id: number;
    name: string;
  };
}

interface Fee {
  id: number;
  type: string;
  description: string;
  amount: number;
}

interface PendingTransactionDetails {
  status: string;
  balance: number;
  year: number;
  month: string;
  date: string;
  fee: Fee;
}

interface TransactionDetails {
  id: number;
  fee: Fee;
  target_date: string;
  total: number;
  balance: number;
  is_paid: boolean;
  is_revoked: boolean;
  is_finished: boolean;
  started_at: string;
  finished_at: string;
  remarks: string;
}

interface EnrollmentData {
  id: number;
  is_paid: boolean;
  is_exonerated: boolean;
  courses: Course[];
  transaction: TransactionDetails;
  registered_at: string;
}

interface TutorData {
  id: number;
  id_card: string;
  name: string;
  email: string;
  phone_number: string;
  city: string;
  address: string;
  registered_at: string;
}

interface StatusHistory {
  removed_at: Date;
  reason: string | null,
  recovered_at: Date | null;
}

interface StudentProfileData {
  id: number;
  id_card: string;
  name: string;
  date_of_birth: string;
  age: number;
  email: string;
  phone_number: string;
  city: string;
  address: string;
  school_name: string;
  school_year: number;
  is_enrolled: boolean;
  is_active: boolean;
  registered_at: Date;
  updated_at: string;
  tutor: TutorData;
  tutor_kinship: string;
  enrollment: EnrollmentData;
  status_history: StatusHistory[];
}

const StudentProfile: React.FC = () => {
  const { id } = useParams();
  const [colorMode] = useColorMode();
  const [theme, setTheme] = useState(themeLightCold);
  const [studentData, setStudentData] = useState<StudentProfileData | null>(null);
  const [finishedTransactionsData, setFinishedTransactionsData] = useState<TransactionDetails[] | null>(null);
  const [statusHistoryData, setStatusHistoryData] = useState<StatusHistory[]>([]);
  const [pendingTransactionsData, setpendingTransactionsData] = useState<PendingTransactionDetails[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [studentFound, setStudentFound] = useState<boolean>(true);
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentInfo = async () => {
      setLoading(true);
      setError("");
      try {
        let response = await fetch(`${API_URL}/students.get?student_id=${id}`,
          {
            credentials: 'include',
            headers: { 'Authorization': `${API_KEY}`, 'Content-Type': 'application/json' }
          }
        );
        if (!response.ok) {
          if (response.status === 404) {
            setStudentFound(false);
            return;
          }

          setError('Error al cargar la información del estudiante.');
          return;
        }

        const studentProfileData: StudentProfileData = await response.json();

        response = await fetch(`${API_URL}/transactions.list?student_id=${id}`,
          {
            credentials: 'include',
            headers: { 'Authorization': `${API_KEY}`, 'Content-Type': 'application/json' }
          }
        );

        if (!response.ok) {
          setError('Error al cargar la información del estudiante.');
          return;
        }

        const studentTransactionsData = await response.json();

        response = await fetch(`${API_URL}/transactions.pending.list?student_id=${id}`,
          {
            credentials: 'include',
            headers: { 'Authorization': `${API_KEY}`, 'Content-Type': 'application/json' }
          }
        );

        if (!response.ok) {
          setError('Error al cargar la información del estudiante.');
          return;
        }

        const studentPendingTransactionsData = await response.json();
        setStudentData(studentProfileData);
        setStatusHistoryData(studentProfileData.status_history ?? []);
        setFinishedTransactionsData(studentTransactionsData);
        setpendingTransactionsData(studentPendingTransactionsData);
      } catch (e: any) {
        setError(e);
        console.error('Error fetching student data:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentInfo();
  }, [id]);

  const personalData: DataItem[] = [
    { label: 'Cédula', value: studentData?.id_card },
    { label: 'Nacimiento', value: `${new Date(studentData?.date_of_birth + "T00:00:00-06:00").toLocaleDateString('es-NI', { year: 'numeric', month: 'long', day: 'numeric', })} (${studentData?.age} años)` },
    { label: 'Correo', value: studentData?.email },
    { label: 'Teléfono', value: studentData?.phone_number },
    { label: 'Ciudad', value: studentData?.city },
    { label: 'Dirección', value: studentData?.address },
  ];

  let tutorData: DataItem[] = [];
  if (!!studentData) {
    const tutor = studentData.tutor;
    tutorData = [
      { label: 'Parentesco', value: !!studentData?.tutor_kinship ? studentData.tutor_kinship.name : '—' },
      { label: 'Nombre', value: !!tutor ? tutor.name : '—' },
      { label: 'Cédula', value: !!tutor ? tutor.id_card : '—' },
      { label: 'Correo', value: !!tutor ? tutor.email : '—' },
      { label: 'Teléfono', value: !!tutor ? tutor.phone_number : '—' },
      { label: 'Ciudad', value: !!tutor ? tutor.city : '—' },
      { label: 'Dirección', value: !!tutor ? tutor.address : '—' },
    ];
  }

  const enrollmentData: DataItem[] = [
    { label: 'Curso(s)', value: `${studentData?.enrollment?.courses?.map(item => item.course.name).join(', ') || '—'}` },
    { label: '¿Exonerada?', value: `${studentData?.enrollment?.is_exonerated ? 'Sí' : 'No'}` },
    { label: '¿Pago finalizado?', value: `${studentData?.enrollment.is_paid ? 'Sí' : 'No'}` },
    { label: 'Registro', value: new Date(studentData?.enrollment.registered_at).toLocaleDateString('es-NI', { year: 'numeric', month: 'long', day: 'numeric', }) }
  ];

  const academicData: DataItem[] = [
    { label: 'Colegio de procedencia', value: !!studentData?.school_name ? studentData?.school_name : '—' },
    { label: 'Año escolar', value: !!studentData?.school_name ? studentData?.school_year : '—' }
  ];

  //cambia el tema del aggrid segun el estado de colorMode
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

  const pendingGridRef = useRef<AgGridReact<Transaction>>(null);
  const finalizedGridRef = useRef<AgGridReact<Transaction>>(null);
  const statusHistoryGridRef = useRef<AgGridReact<Transaction>>(null);

  const formatText = (value: string) => {
    if (!value) {
      return '—';
    }

    return value;
  };

  const formatDateTime = (value: string) => {
    if (!value) {
      return '—';
    }
    const date = new Date(value);
    const dateString = date.toLocaleDateString('es-NI', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timeString = date.toLocaleTimeString('es-NI', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
    return `${dateString} ${timeString}`;
  };

  const formatDate = (value: string) => {
    if (!value) {
      return '—';
    }
    const date = new Date(value + "T00:00:00-06:00");
    return date.toLocaleDateString('es-NI', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const nioFormatter = new Intl.NumberFormat('es-NI', {
    style: 'currency',
    currency: 'NIO'
  });

  const formatNIO = (value: number) => {
    return nioFormatter.format(value);
  };

  const formatShortDate = (value: number) => {
    if (!value) {
      return '—';
    }
    const date = new Date(value + "T00:00:00-06:00");
 return date.toLocaleDateString('es-NI');

  };

  const formatShortDateTime = (value: number) => {
    if (!value) {
      return '—';
    }
    const date = new Date(value);
    const dateString = date.toLocaleDateString('es-NI');
    const timeString = date.toLocaleTimeString('es-NI');
    return `${dateString} ${timeString}`;
  };


  const finalizedColumnDefs: ColDef<Transaction>[] = useMemo(
    () => [
      { field: 'id', headerName: 'ID' },
      { field: 'fee.label', headerName: 'Tipo' },
      { field: 'total', headerName: 'Total', valueFormatter: (params) => formatNIO(params.value) },
      { field: 'balance', headerName: 'Saldo', valueFormatter: (params) => formatNIO(params.value) },
      { field: 'target_date', headerName: 'Fec. selec.', valueFormatter: (params) => formatShortDate(params.value) },
      { field: 'started_at', headerName: 'Fec. inic.', valueFormatter: (params) => formatShortDateTime(params.value) },
      { field: 'finished_at', headerName: 'Fec. fina.', valueFormatter: (params) => formatShortDateTime(params.value) },
      { field: 'remarks', headerName: 'Concepto', flex: 2, valueFormatter: (params) => formatText(params.value) },
      { field: 'is_finished', headerName: '¿Finalizada?' },
      { field: 'is_revoked', headerName: '¿Revocada?' },
            {
              headerName: 'Acción',
              field: 'action',
              cellRenderer: (params: any) => {
                  return (
                      <button
                        title='Ver transacción'
                        className={clsx(colorVariants["orange"].btnSc)}
                        onClick={() => navigate(`/transaction/${params.data.id}`)}
                      >
                        <FaArrowRight />
                      </button>
                  );
              },
            },
    ],
    []
  );

  const pendingColumnDefs: ColDef<Transaction>[] = useMemo(
    () => [
      { field: 'status', headerName: 'Estado' },
      { field: 'fee.label', headerName: 'Tipo', flex: 1 },
      { field: 'balance', headerName: 'Saldo pendiente', flex: 1, valueFormatter: (params) => formatNIO(params.value) },
      { field: 'year', headerName: 'Año', flex: 1 },
      { field: 'date', headerName: 'Fecha', flex: 1, valueFormatter: (params) => formatDate(params.value) },
    ],
    []
  );

  const statusHistoryColumnDefs: ColDef<StatusHistory>[] = useMemo(
    () => [
      { field: 'removed_at', headerName: 'Fecha de desactivación', valueFormatter: (params) => formatDateTime(params.value), },
      { field: 'reason', headerName: 'Razón', flex: 1, valueFormatter: (params) => formatText(params.value), },
      { field: 'recovered_at', headerName: 'Fecha de reingreso', flex: 1, valueFormatter: (params) => formatDateTime(params.value), },
    ],
    []
  );


  if (loading || isLoading) {
    return <Loader />
  }

  if (!studentFound) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-red-600 mb-4">Estudiante no encontrado</h2>
          <p className="text-lg text-gray-600">
            No se encontró ningún estudiante con el ID proporcionado.
          </p>
        </div>
      </div>
    );
  }

  if (error !== "") {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-red-600 mb-4">{error}</h2>
          <p className="text-lg text-gray-600">
            Vuelve a intentar más tarde.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="student-profile-div bg-gray-100 dark:bg-gray-700">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-1">
          <h2 className="text-4xl sm:text-4xl font-bold mb-2 sm:mb-0">
            {studentData?.name}
          </h2>

          {user?.role === "admin" ?
            <div>
              {studentData?.enrollment.is_exonerated
                ?
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline me-3"
                  onClick={() => {
                    Swal.fire({
                      title: "¿Está seguro?",
                      text: "La matrícula del estudiante dejará de ser exonerada.",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonText: "Continuar",
                      denyButtonText: "Cancelar",
                      customClass: {
                        popup: 'bg-white text-black dark:bg-boxdark-2 dark:text-white',
                        confirmButton: 'bg-yellow-500 text-white dark:bg-boxdark dark:text-white',
                        cancelButton: 'bg-blue-500 text-white dark:bg-boxdark dark:text-white',
                      },
                    }).then((result) => {
                      if (result.isConfirmed) {
                        (async () => {
                          try {
                            const response = await fetch(`${API_URL}/students.charge`, {
                              method: 'POST',
                              credentials: "include",
                              headers: {
                                'Authorization': `${API_KEY}`,
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({ student_id: Number(id) }),
                            });

                            if (!response.ok) {
                              throw new Error(`HTTP error! status: ${response.status}`);
                            }

                            window.location.reload()
                            // navigate(`/student/${id}`);
                          } catch (error) {
                            console.error('Error al cobrar matrícula:', error);
                          }
                        })();
                      }
                    });

                  }}
                >
                  Cobrar
                </button>
                :
                <button
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline me-3"
                  onClick={() => {
                    Swal.fire({
                      title: "¿Está seguro?",
                      text: "Al exonerar este estudiante, no se le cargarán las renovaciones de matrícula.",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonText: "Continuar",
                      denyButtonText: "Cancelar",
                      customClass: {
                        popup: 'bg-white text-black dark:bg-boxdark-2 dark:text-white',
                        confirmButton: 'bg-yellow-500 text-white dark:bg-boxdark dark:text-white',
                        cancelButton: 'bg-blue-500 text-white dark:bg-boxdark dark:text-white',
                      },
                    }).then((result) => {
                      if (result.isConfirmed) {
                        (async () => {
                          try {
                            const response = await fetch(`${API_URL}/students.exonerate`, {
                              method: 'POST',
                              credentials: "include",
                              headers: {
                                'Authorization': `${API_KEY}`,
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({ student_id: Number(id) }),
                            });

                            if (!response.ok) {
                              throw new Error(`HTTP error! status: ${response.status}`);
                            }

                            window.location.reload()
                            // navigate(`/student/${id}`);
                          } catch (error) {
                            console.error('Error al exonerar:', error);
                          }
                        })();
                      }
                    });
                  }}
                >
                  Exonerar
                </button>}

              {studentData?.is_active
                ?
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => {
                    Swal.fire({
                      title: "¿Está seguro?",
                      text: "Al desactivar este estudiante, no se le podrán asociar transacciones.",
                      icon: "warning",
                      input: "textarea",
                      inputPlaceholder: "Alguna razón por la cual es desactivado (opcional).",
                      showCancelButton: true,
                      confirmButtonText: "Continuar",
                      denyButtonText: "Cancelar",
                      customClass: {
                        popup: 'bg-white text-black dark:bg-boxdark-2 dark:text-white',
                        confirmButton: 'bg-red-500 text-white dark:bg-boxdark dark:text-white',
                        cancelButton: 'bg-blue-500 text-white dark:bg-boxdark dark:text-white',
                      },
                    }).then((result) => {
                      if (result.isConfirmed) {
                        (async () => {
                          try {
                            const response = await fetch(`${API_URL}/students.remove`, {
                              method: 'POST',
                              credentials: "include",
                              headers: {
                                'Authorization': `${API_KEY}`,
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({ student_id: Number(id), reason: result.value }),
                            });

                            if (!response.ok) {
                              throw new Error(`HTTP error! status: ${response.status}`);
                            }

                            window.location.reload()
                            // navigate(`/student/${id}`);
                          } catch (error) {
                            console.error('Error al desactivar:', error);
                          }
                        })();
                      }
                    });

                  }}
                >
                  Desactivar
                </button>
                :
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => {
                    Swal.fire({
                      title: "¿Está seguro?",
                      text: "Todos los cobros del estudiante volverán a la normalidad.",
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonText: "Continuar",
                      denyButtonText: "Cancelar",
                      customClass: {
                        popup: 'bg-white text-black dark:bg-boxdark-2 dark:text-white',
                        confirmButton: 'bg-green-500 text-white dark:bg-boxdark dark:text-white',
                        cancelButton: 'bg-blue-500 text-white dark:bg-boxdark dark:text-white',
                      },
                    }).then((result) => {
                      if (result.isConfirmed) {
                        (async () => {
                          try {
                            const response = await fetch(`${API_URL}/students.recover`, {
                              method: 'POST',
                              credentials: "include",
                              headers: {
                                'Authorization': `${API_KEY}`,
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({ student_id: Number(id) }),
                            });

                            if (!response.ok) {
                              throw new Error(`HTTP error! status: ${response.status}`);
                            }

                            window.location.reload()
                            // navigate(`/student/${id}`);
                          } catch (error) {
                            console.error('Error al activar:', error);
                          }
                        })();
                      }
                    });

                  }}
                >
                  Activar
                </button>
              }
            </div>

            : <></>}



        </div>
        <p className="text-md text-gray-600 dark:text-gray-400">
          <span className="font-semibold">Registro:</span> {new Date(studentData?.registered_at).toLocaleDateString('es-NI', { year: 'numeric', month: 'long', day: 'numeric', })}
          <span> | </span>

          {studentData?.is_active ? <span className="text-green-500">(Activo)</span> : <span className="text-red-500">(Inactivo)</span>}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white dark:bg-gray-800 shadow rounded-md p-6">
          <h3 className="text-2xl font-semibold mb-4">Datos Personales</h3>
          {personalData.map((item) => (
            <div key={item.label} className="grid grid-cols-2 gap-y-4 text-lg">
              <dt className="font-medium text-gray-700 dark:text-gray-300 mb-1">{item.label}</dt>
              <dd className="text-gray-600 dark:text-gray-400">{item.value}</dd>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-md p-6">
          <h3 className="text-2xl font-semibold mb-4">Datos del Tutor</h3>
          {tutorData.map((item) => (
            <div key={item.label} className="grid grid-cols-2 gap-y-4 text-lg">
              <dt className="font-medium text-gray-700 dark:text-gray-300 mb-1">{item.label}</dt>
              <dd className="text-gray-600 dark:text-gray-400">{item.value}</dd>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white dark:bg-gray-800 shadow rounded-md p-6">
          <h3 className="text-2xl font-semibold mb-4">Matrícula</h3>
          {enrollmentData.map((item) => (
            <div key={item.label} className="grid grid-cols-2 gap-y-4 text-lg">
              <dt className="font-medium text-gray-700 dark:text-gray-300 mb-1">{item.label}</dt>
              <dd className="text-gray-600 dark:text-gray-400">{item.value}</dd>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-md p-6">
          <h3 className="text-2xl font-semibold mb-4">Datos Académicos</h3>
          {academicData.map((item) => (
            <div key={item.label} className="grid grid-cols-2 gap-y-4 text-lg">
              <dt className="font-medium text-gray-700 dark:text-gray-300 mb-1">{item.label}</dt>
              <dd className="text-gray-600 dark:text-gray-400">{item.value}</dd>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-2">Todas las transacciones ({finishedTransactionsData?.length})</h3>
        <div className="w-full h-125">
          <AgGridReact
            ref={finalizedGridRef}
            rowData={finishedTransactionsData}
            theme={theme}
            columnDefs={finalizedColumnDefs}
            defaultColDef={defaultColDef}
            rowSelection="single"
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-2">Transacciones pendientes ({pendingTransactionsData?.length})</h3>
        <div className="w-full h-75">
          <AgGridReact
            ref={pendingGridRef}
            rowData={pendingTransactionsData}
            theme={theme}
            columnDefs={pendingColumnDefs}
            defaultColDef={defaultColDef}
            rowSelection="single"
          />
        </div>
      </div>


      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-2">Historial de desactivaciones ({statusHistoryData.length})</h3>
        <div className="w-full h-50">
          <AgGridReact
            ref={statusHistoryGridRef}
            rowData={statusHistoryData}
            theme={theme}
            columnDefs={statusHistoryColumnDefs}
            defaultColDef={defaultColDef}
            rowSelection="single"
          />
        </div>
      </div>
    </div>

  )
};

export default StudentProfile;

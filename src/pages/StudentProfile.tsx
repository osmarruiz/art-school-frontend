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
import Swal from 'sweetalert2';
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import { colorVariants } from '../types/colorVariants';
import clsx from 'clsx';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import { Student } from '../types/student';
import { StatusHistory } from '../types/statusHistory';
import { Transaction } from '../types/transaction';
import { TransactionsPending } from '../types/transactionsPending';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDateFlexible } from '../utils/formatDateflexible';
import FormCourse from '../components/Forms/FormCourse';
import Switcher from '../components/Forms/Switcher/Switcher';
import processCourseChanges from '../utils/processCourseChanges';

ModuleRegistry.registerModules([AllCommunityModule]);
const themeLightCold = themeQuartz.withPart(colorSchemeLightCold);
const themeDarkBlue = themeQuartz.withPart(colorSchemeDarkBlue);

interface DataItem {
  label: string;
  value: string | number | React.ReactNode;
}

const StudentProfile: React.FC = () => {
  const { id } = useParams();
  const [colorMode] = useColorMode();
  const [theme, setTheme] = useState(themeLightCold);
  const [studentData, setStudentData] = useState<Student>();
  const [finishedTransactionsData, setFinishedTransactionsData] =
    useState<Transaction[]>();
  const [statusHistoryData, setStatusHistoryData] = useState<StatusHistory[]>(
    [],
  );
  const [pendingTransactionsData, setpendingTransactionsData] =
    useState<TransactionsPending[]>();
  const [loading, setLoading] = useState(true);
  const [studentFound, setStudentFound] = useState<boolean>(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [switcherSchoolEnabled, setSwitcherSchoolEnabled] = useState(false);
  const [courseSelection, setCourseSelection] = useState<
    {
      courseId: number | null;
      shiftId: number | null;
      courseName: string | null;
      shiftName: string;
    }[]
  >([]);

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
        setpendingTransactionsData(pendingData);
      } catch (e: any) {
        console.error('Error fetching student data:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentInfo();
  }, [id]);

  const personalData: DataItem[] = [
    { label: 'Cédula', value: studentData?.id_card },
    {
      label: 'Nacimiento',
      value: `${new Date(
        studentData?.date_of_birth + 'T00:00:00-06:00',
      ).toLocaleDateString('es-NI', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })} (${studentData?.age} años)`,
    },
    { label: 'Correo', value: studentData?.email },
    { label: 'Teléfono', value: studentData?.phone_number },
    { label: 'Ciudad', value: studentData?.city },
    { label: 'Dirección', value: studentData?.address },
  ];

  let tutorData: DataItem[] = [];
  if (!!studentData) {
    const tutor = studentData.tutor;

    tutorData = [
      { label: 'Parentesco', value: studentData?.tutor_kinship?.name || '—' },
      { label: 'Nombre', value: !!tutor ? tutor.name : '—' },
      { label: 'Cédula', value: !!tutor ? tutor.id_card : '—' },
      { label: 'Correo', value: !!tutor ? tutor.email : '—' },
      { label: 'Teléfono', value: !!tutor ? tutor.phone_number : '—' },
      { label: 'Ciudad', value: !!tutor ? tutor.city : '—' },
      { label: 'Dirección', value: !!tutor ? tutor.address : '—' },
    ];
  }

  const enrollmentData: DataItem[] = [
    {
      label: 'Curso(s)',
      value: `${
        studentData?.enrollment?.courses
          .map((item) => item.course.name)
          .join(', ') || '—'
      }`,
    },
    {
      label: 'Turno(s)',
      value: `${
        studentData?.enrollment?.courses
          .map((item) => item.shift.name)
          .join(', ') || '—'
      }`,
    },
    {
      label: 'Tel. emergencia',
      value: `${studentData?.enrollment.emergency_number || '—'}`,
    },
    {
      label: '¿Exonerada?',
      value: `${studentData?.enrollment?.is_exonerated ? 'Sí' : 'No'}`,
    },
    {
      label: '¿Pago finalizado?',
      value: `${studentData?.enrollment.is_paid ? 'Sí' : 'No'}`,
    },
    {
      label: 'Matriculación',
      value: studentData?.enrollment.registered_at
        ? (() => {
            const registeredAtUTC = studentData.enrollment.registered_at;
            const year = parseInt(registeredAtUTC.substring(0, 4));
            const month = parseInt(registeredAtUTC.substring(5, 7)) - 1;
            const day = parseInt(registeredAtUTC.substring(8, 10));

            const localDateInterpretation = new Date(year, month, day);

            return localDateInterpretation.toLocaleDateString('es-NI', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });
          })()
        : '—',
    },
    {
      label: 'Registro al sistema',
      value: studentData?.registered_at
        ? new Date(studentData.registered_at).toLocaleDateString('es-NI', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : '—',
    },
  ];

  const academicData: DataItem[] = [
    {
      label: 'Colegio de procedencia',
      value: !!studentData?.school_name ? studentData?.school_name : '—',
    },
    {
      label: 'Año escolar',
      value: !!studentData?.school_name ? studentData?.school_year : '—',
    },
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

  const handleSaveChanges = async () => {
    if (studentData) {
      await processCourseChanges(
        Number(id),
        courseSelection,
        studentData,
        navigate,
      );
    }
  };

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
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-1">
            <div>
              <h2 className="text-4xl sm:text-4xl font-bold mb-2 sm:mb-0">
                {studentData?.name}
              </h2>

              <p className="text-md text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Matriculación:</span>{' '}
                {studentData?.enrollment.registered_at
                  ? (() => {
                      const registeredAtUTC =
                        studentData.enrollment.registered_at;
                      const year = parseInt(registeredAtUTC.substring(0, 4));
                      const month =
                        parseInt(registeredAtUTC.substring(5, 7)) - 1;
                      const day = parseInt(registeredAtUTC.substring(8, 10));

                      const localDateInterpretation = new Date(
                        year,
                        month,
                        day,
                      );

                      return localDateInterpretation.toLocaleDateString(
                        'es-NI',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        },
                      );
                    })()
                  : '—'}
                <span> | </span>
                {studentData?.is_active ? (
                  <span className="text-green-500">(Activo)</span>
                ) : (
                  <span className="text-red-500">(Inactivo)</span>
                )}
              </p>
            </div>

<div className="flex items-center mt-4 sm:mt-0 gap-2 ">
              {user?.role === 'admin' ? (
                <div>
                  {studentData?.enrollment.is_exonerated ? (
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline me-3"
                      onClick={() => {
                        Swal.fire({
                          title: '¿Está seguro?',
                          text: 'La matrícula del estudiante dejará de ser exonerada.',
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonText: 'Continuar',
                          denyButtonText: 'Cancelar',
                          customClass: {
                            popup:
                              'bg-white text-black dark:bg-boxdark-2 dark:text-white',
                            confirmButton:
                              'bg-yellow-500 text-white dark:bg-boxdark dark:text-white',
                            cancelButton:
                              'bg-blue-500 text-white dark:bg-boxdark dark:text-white',
                          },
                        }).then((result) => {
                          if (result.isConfirmed) {
                            (async () => {
                              try {
                                const response = await fetch(
                                  `${API_URL}/students.charge`,
                                  {
                                    method: 'POST',
                                    credentials: 'include',
                                    headers: {
                                      Authorization: `${API_KEY}`,
                                      'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                      student_id: Number(id),
                                    }),
                                  },
                                );

                                if (!response.ok) {
                                  throw new Error(
                                    `HTTP error! status: ${response.status}`,
                                  );
                                }

                                navigate(`/student/${id}`);
                              } catch (error) {
                                console.error(
                                  'Error al cobrar matrícula:',
                                  error,
                                );
                              }
                            })();
                          }
                        });
                      }}
                    >
                      Cobrar
                    </button>
                  ) : (
                    <button
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline me-3"
                      onClick={() => {
                        Swal.fire({
                          title: '¿Está seguro?',
                          text: 'Al exonerar este estudiante, no se le cargarán las renovaciones de matrícula.',
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonText: 'Continuar',
                          denyButtonText: 'Cancelar',
                          customClass: {
                            popup:
                              'bg-white text-black dark:bg-boxdark-2 dark:text-white',
                            confirmButton:
                              'bg-yellow-500 text-white dark:bg-boxdark dark:text-white',
                            cancelButton:
                              'bg-blue-500 text-white dark:bg-boxdark dark:text-white',
                          },
                        }).then((result) => {
                          if (result.isConfirmed) {
                            (async () => {
                              try {
                                const response = await fetch(
                                  `${API_URL}/students.exonerate`,
                                  {
                                    method: 'POST',
                                    credentials: 'include',
                                    headers: {
                                      Authorization: `${API_KEY}`,
                                      'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                      student_id: Number(id),
                                    }),
                                  },
                                );

                                if (!response.ok) {
                                  throw new Error(
                                    `HTTP error! status: ${response.status}`,
                                  );
                                }

                                navigate(`/student/${id}`);
                              } catch (error) {
                                console.error('Error al exonerar:', error);
                              }
                            })();
                          }
                        });
                      }}
                    >
                      Exonerar
                    </button>
                  )}

                  {studentData?.is_active ? (
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => {
                        Swal.fire({
                          title: '¿Está seguro?',
                          text: 'Al desactivar este estudiante, no se le podrán asociar transacciones.',
                          icon: 'warning',
                          input: 'textarea',
                          inputPlaceholder:
                            'Alguna razón por la cual es desactivado (opcional).',
                          showCancelButton: true,
                          confirmButtonText: 'Continuar',
                          denyButtonText: 'Cancelar',
                          customClass: {
                            popup:
                              'bg-white text-black dark:bg-boxdark-2 dark:text-white',
                            confirmButton:
                              'bg-red-500 text-white dark:bg-boxdark dark:text-white',
                            cancelButton:
                              'bg-blue-500 text-white dark:bg-boxdark dark:text-white',
                          },
                        }).then((result) => {
                          if (result.isConfirmed) {
                            (async () => {
                              try {
                                const response = await fetch(
                                  `${API_URL}/students.remove`,
                                  {
                                    method: 'POST',
                                    credentials: 'include',
                                    headers: {
                                      Authorization: `${API_KEY}`,
                                      'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                      student_id: Number(id),
                                      reason: result.value,
                                    }),
                                  },
                                );

                                if (!response.ok) {
                                  throw new Error(
                                    `HTTP error! status: ${response.status}`,
                                  );
                                }
                                navigate(`/student/${id}`);
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
                  ) : (
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => {
                        Swal.fire({
                          title: '¿Está seguro?',
                          text: 'Todos los cobros del estudiante volverán a la normalidad.',
                          icon: 'question',
                          showCancelButton: true,
                          confirmButtonText: 'Continuar',
                          denyButtonText: 'Cancelar',
                          customClass: {
                            popup:
                              'bg-white text-black dark:bg-boxdark-2 dark:text-white',
                            confirmButton:
                              'bg-green-500 text-white dark:bg-boxdark dark:text-white',
                            cancelButton:
                              'bg-blue-500 text-white dark:bg-boxdark dark:text-white',
                          },
                        }).then((result) => {
                          if (result.isConfirmed) {
                            (async () => {
                              try {
                                const response = await fetch(
                                  `${API_URL}/students.recover`,
                                  {
                                    method: 'POST',
                                    credentials: 'include',
                                    headers: {
                                      Authorization: `${API_KEY}`,
                                      'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                      student_id: Number(id),
                                    }),
                                  },
                                );

                                if (!response.ok) {
                                  throw new Error(
                                    `HTTP error! status: ${response.status}`,
                                  );
                                }

                                navigate(`/student/${id}`);
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
                  )}
                </div>
              ) : (
                <></>
              )}
              <div
                className={clsx(
                  'flex h-8.5 w-8.5 items-center justify-center rounded-full hover:cursor-pointer',
                  colorVariants['white'].btn
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(-1);
                }}
              >
                <FaArrowLeft size={20} />
              </div>
              </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div
            className={clsx(
              'shadow rounded-md p-6',
              colorVariants['white'].icon,
            )}
          >
            <h3 className="text-2xl font-semibold mb-4">Datos Personales</h3>
            {personalData.map((item) => (
              <div
                key={item.label}
                className="grid grid-cols-2 gap-y-4 text-lg break-words"
              >
                <dt className="font-medium text-gray-700 dark:text-gray-300 mb-1 whitespace-nowrap">
                  {item.label}
                </dt>
                <dd className="text-gray-600 dark:text-gray-400 break-words overflow-hidden">
                  {item.value}
                </dd>
              </div>
            ))}
          </div>

          <div
            className={clsx(
              ' shadow rounded-md p-6',
              colorVariants['white'].icon,
            )}
          >
            <h3 className="text-2xl font-semibold mb-4">Datos del Tutor</h3>
            {tutorData.map((item) => (
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div
            className={clsx(
              ' shadow rounded-md p-6',
              colorVariants['white'].icon,
            )}
          >
            <h3 className="text-2xl font-semibold mb-4">Matrícula</h3>
            {enrollmentData.map((item) => (
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

            {user?.role === 'admin' && (
              <>
                <hr className="mt-3 mb-3" />
                <div>
                  <label className="block text-2xl dark:text-white mb-3">
                    Editar curso(s)
                  </label>
                  <Switcher
                    enabled={switcherSchoolEnabled}
                    onToggle={setSwitcherSchoolEnabled}
                    labelId="toggleSchool"
                  />
                </div>

                {switcherSchoolEnabled && (
                  <>
                    <FormCourse
                      onCourseChange={setCourseSelection}
                      preloadData={studentData?.enrollment.courses}
                    />
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline me-3 mt-3"
                      onClick={() => {
                        Swal.fire({
                          title: '¿Estás seguro?',
                          text: 'Los cursos del estudiante serán modificados. El pago total de las transacciones no será modificado al alterar los cursos, es posible que tengas que revocar las transacciones de mensualidad para evitar incoherencias.',
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonText: 'Continuar',
                          denyButtonText: 'Cancelar',
                          customClass: {
                            popup:
                              'bg-white text-black dark:bg-boxdark-2 dark:text-white',
                            confirmButton:
                              'bg-yellow-500 text-white dark:bg-boxdark dark:text-white',
                            cancelButton:
                              'bg-blue-500 text-white dark:bg-boxdark dark:text-white',
                          },
                        }).then((result) => {
                          if (result.isConfirmed) {
                            (async () => {
                              try {
                                await handleSaveChanges();
                              } catch (error) {
                                console.error(
                                  'Error al actualizar los cursos:',
                                  error,
                                );
                              }
                            })();
                          }
                        });
                      }}
                    >
                      Guardar información
                    </button>
                  </>
                )}
              </>
            )}
          </div>

          <div
            className={clsx(
              ' shadow rounded-md p-6',
              colorVariants['white'].icon,
            )}
          >
            <h3 className="text-2xl font-semibold mb-4">Datos Académicos</h3>
            {academicData.map((item) => (
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

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FaArrowRight, FaRepeat } from 'react-icons/fa6';
import CardOperator from '../../components/Cards/CardOperator';
import StudentSearch from '../../components/Tables/TableStudentSearch';
import { Student } from '../../types/student';
import { colorVariants } from '../../utils/colorVariants';
import clsx from 'clsx';
import CardStudent from '../../components/Cards/CardStudent';
import { AgGridReact } from 'ag-grid-react';
import {
  AllCommunityModule,
  ModuleRegistry
} from 'ag-grid-community';
import { API_KEY, API_URL } from '../../utils/apiConfig';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { formatDateFlexible } from '../../utils/formatDateflexible';
import { motion } from 'framer-motion';
import { useAgGridConfig } from '../../hooks/useAgGridConfig';

ModuleRegistry.registerModules([AllCommunityModule]);
interface RenewalRecord {
  id: number;
  enrollment: number;
  renews: number;
  transaction_id: number;
  registered_at: string;
}

const Renew = ({
  color,
}: {
  color: 'violet' | 'white' | 'red' | 'orange' | 'green';
}) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [renewals, setRenewals] = useState<RenewalRecord[]>([]);
  const navigate = useNavigate();
  const { theme, defaultColDef, localeText } = useAgGridConfig();

  const fetchHistory = useCallback(async () => {
    if (!selectedStudent) return;
    try {
      const response = await fetch(
        `${API_URL}/students.renewals.list?student_id=${selectedStudent.id}`,
        {
          headers: {
            Authorization: API_KEY,
          },
          credentials: 'include',
        },
      );
      const data = await response.json();
      setRenewals(data);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  }, [selectedStudent]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const tableRef = useRef<AgGridReact>(null);
  const columnDefs = useMemo(
    () => [
      {
        field: 'registered_at',
        headerName: 'Año',
        valueFormatter: (p: any) =>
          formatDateFlexible(p.value, {
            type: 'year',
            withTimezoneOffset: true,
          }),
      },
      {
        field: 'registered_at',
        headerName: 'Fecha',
        valueFormatter: (p: any) =>
          formatDateFlexible(p.value, {
            type: 'date',
            withTimezoneOffset: true,
          }),
      },
      { field: 'transaction_id', headerName: 'ID Transacción' },
      {
        headerName: 'Acción',
        field: 'action',
        cellRenderer: (params: any) => {
          if (!params.data.is_revoked) {
            return (
              <button
                title="Ver transacción"
                className={clsx(colorVariants[color].btnSc)}
                onClick={() =>
                  navigate(`/transaction/${params.data.transaction_id}`)
                }
              >
                <FaArrowRight />
              </button>
            );
          }
          return <p className="text-red-500">(Revocado)</p>;
        },
      },
    ],
    [],
  );

  return (
    <CardOperator
      title="Renovar Matrícula"
      subtitle="Renovar la matrícula de un estudiante."
      color="orange"
    >
      <FaRepeat size={20} className="text-white" />
      <div>
        <p
          className={clsx('text-3xl font-bold mb-2', colorVariants[color].text)}
        >
          Estudiante
        </p>
        {!selectedStudent ? (
          <StudentSearch onSelect={setSelectedStudent} color="red" />
        ) : (
          <CardStudent
            student={selectedStudent}
            onReset={() => setSelectedStudent(null)}
            color="orange"
          />
        )}
      </div>

      <div>
        <p
          className={clsx('text-3xl font-bold mb-2', colorVariants[color].text)}
        >
          Historial renovaciones
        </p>
        {selectedStudent ? (
          renewals.length > 0 ? (
            <motion.div
              animate={{ scale: [0.9, 1] }}
              transition={{ duration: 0.3 }}
              className="w-full h-100"
            >
              <AgGridReact
                ref={tableRef}
                rowData={renewals}
                theme={theme}
                localeText={localeText}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                rowSelection="single"
              />
            </motion.div>
          ) : (
            <p
              className={clsx(
                'text-l py-5 font-medium ',
                colorVariants[color].text,
              )}
            >
              Este estudiante no tiene ninguna renovación.
            </p>
          )
        ) : (
          <p
            className={clsx(
              'text-l py-5 font-medium ',
              colorVariants[color].text,
            )}
          >
            Selecciona un estudiante para ver sus renovaciones anteriores.
          </p>
        )}
      </div>

      {selectedStudent && (
        <button
          className={clsx(
            'inline-flex items-center justify-center py-4 px-10',
            colorVariants[color].btn,
          )}
          onClick={async () => {
            const result = await Swal.fire({
              title: '¿Estás seguro?',
              text: 'Presiona continuar para renovar la matrícula de este estudiante.',
              icon: 'warning',
              showCancelButton: true,
              customClass: {
                popup: 'bg-white text-black dark:bg-boxdark-2 dark:text-white',
                confirmButton:
                  'bg-blue-500 text-white dark:bg-boxdark dark:text-white',
                cancelButton:
                  'bg-gray-300 text-black dark:bg-gray-700 dark:text-white',
              },
              confirmButtonText: 'Sí, renovar',
              cancelButtonText: 'No, cancelar',
            });

            if (result.isConfirmed) {
              (async () => {
                try {
                  const response = await fetch(
                    `${API_URL}/students.renew_enrollment`,
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: API_KEY,
                      },
                      body: JSON.stringify({ student_id: selectedStudent?.id }),
                      credentials: 'include',
                    },
                  );

                  const data = await response.json();

                  if (response.status === 202) {
                    Swal.fire({
                      title: 'Problemas al renovar matrícula',
                      html: `
                    <p>${data.detail}</p>
                    <p>Por favor, intente renovar a partir de la fecha: <strong>${new Date(
                      data.with['renovar_hasta'] + 'T00:00:00-06:00',
                    ).toLocaleString('es-NI', {
                      month: 'long',
                      year: 'numeric',
                      day: 'numeric',
                    })}<strong></p>`,
                      icon: 'error',
                      customClass: {
                        popup:
                          'bg-white text-black dark:bg-boxdark-2 dark:text-white',
                        confirmButton:
                          'bg-blue-500 text-white dark:bg-boxdark dark:text-white',
                        cancelButton:
                          'bg-gray-300 text-black dark:bg-gray-700 dark:text-white',
                      },
                    });
                    return;
                  }
                  const result = await Swal.fire({
                    title: 'Renovación iniciada',
                    text: 'Se ha iniciado correctamente una transacción para pagar la renovar de matrícula de este estudiante.',
                    icon: 'success',
                    customClass: {
                      popup:
                        'bg-white text-black dark:bg-boxdark-2 dark:text-white',
                      confirmButton:
                        'bg-blue-500 text-white dark:bg-boxdark dark:text-white',
                      cancelButton:
                        'bg-gray-300 text-black dark:bg-gray-700 dark:text-white',
                    },
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Ver transacción',
                  });

                  if (result.isConfirmed) {
                    navigate(`/transaction/${data['inserted_transaction_id']}`);
                  } else {
                    navigate('/renew');
                  }
                } catch (error) {
                  console.error('Error al enviar datos:', error);
                }
              })();
            }
          }}
        >
          Renovar matricula
        </button>
      )}
    </CardOperator>
  );
};

export default Renew;

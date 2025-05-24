import React from 'react';
import { colorVariants } from '../../utils/colorVariants';
import { FaArrowLeft } from 'react-icons/fa6';
import { Student } from '../../types/student';
import Swal from 'sweetalert2';
import { API_KEY, API_URL } from '../../utils/apiConfig';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

interface HeaderStudentProfileProps {
  studentData: Student;
  user: any;
  navigate: ReturnType<typeof useNavigate>;
}

const HeaderStudentProfile: React.FC<HeaderStudentProfileProps> = ({
  studentData,
  user,
  navigate
}) => {

  return (
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
                                  student_id: Number(studentData.id),
                                }),
                              },
                            );

                            if (!response.ok) {
                              throw new Error(
                                `HTTP error! status: ${response.status}`,
                              );
                            }

                            navigate(`/student/${studentData.id}`);
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
                                  student_id: Number(studentData.id),
                                }),
                              },
                            );

                            if (!response.ok) {
                              throw new Error(
                                `HTTP error! status: ${response.status}`,
                              );
                            }

                            navigate(`/student/${studentData.id}`);
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
                                  student_id: Number(studentData.id),
                                  reason: result.value,
                                }),
                              },
                            );

                            if (!response.ok) {
                              throw new Error(
                                `HTTP error! status: ${response.status}`,
                              );
                            }
                            navigate(`/student/${studentData.id}`);
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
                                  student_id: Number(studentData.id),
                                }),
                              },
                            );

                            if (!response.ok) {
                              throw new Error(
                                `HTTP error! status: ${response.status}`,
                              );
                            }

                            navigate(`/student/${studentData.id}`);
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
              colorVariants['white'].btn,
            )}
            onClick={() => {
              if (user?.role === 'admin') {
                return navigate("/students");
              }
              navigate(-1);
            }}
          >
            <FaArrowLeft size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderStudentProfile;

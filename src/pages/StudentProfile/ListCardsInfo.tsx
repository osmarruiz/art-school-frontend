import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { colorVariants } from '../../utils/colorVariants';
import Switcher from '../../components/Forms/Switcher/Switcher';
import FormStudentEdit from '../../components/Forms/FormStudentEdit';
import Swal from 'sweetalert2';
import FormAcademicEdit from '../../components/Forms/FormAcademicEdit';
import { Student } from '../../types/student';
import { useNavigate } from 'react-router-dom';
import processCourseChanges from '../../utils/processCourseChanges';
import FormCourse from '../../components/Forms/FormCourse';
import { API_KEY, API_URL } from '../../utils/apiConfig';
import  useToast  from '../../hooks/useToast';
import { FaX } from 'react-icons/fa6';
import TableTutorSearch from '../../components/Tables/TableTutorSearch';
import CardTutor from '../../components/Cards/CardTutor';
import { Kinship } from '../../types/kinship';
import { Tutor } from '../../types/tutor';
import SelectGroup from '../../components/Forms/SelectGroup/SelectGroup';
import FormTutorEdit from '../../components/Forms/FormTutorEdit';

interface ListCardsInfoProps {
  studentData: Student;
  user: any;
  navigate: ReturnType<typeof useNavigate>;
}

interface DataItem {
  label: string;
  value: string | number | React.ReactNode;
}

const ListCardsInfo: React.FC<ListCardsInfoProps> = ({
  studentData,
  user,
  navigate,
}) => {
  const [switcherCourseEnabled, setSwitcherCourseEnabled] = useState(false);
  const [switcherPersonalEnabled, setSwitcherPersonalEnabled] = useState(false);
  const [switcherTutorEnabled, setSwitcherTutorEnabled] = useState(false);
  const [switcherAcademicEnabled, setSwitcherAcademicEnabled] = useState(false);
  const { showSuccess, showError } = useToast();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedTutor, setSelectedTutor] = useState<any>(null);
  const [kinshipData, setKinshipData] = useState<Kinship[]>([]);
  const [editedTutor, setEditedTutor] = useState<Tutor | null>(
    studentData?.tutor || null,
  );
  const [studentDataUpdated, setStudentDataUpdated] = useState<Student>({
    ...studentData,
  });
  const [courseSelection, setCourseSelection] = useState<
    {
      courseId: number | null;
      shiftId: number | null;
      courseName: string | null;
      shiftName: string;
    }[]
  >([]);

  const personalData: DataItem[] = [
    { label: 'Cédula', value: studentData?.id_card || '—' },
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
    { label: 'Correo', value: studentData?.email || '—' },
    { label: 'Teléfono', value: studentData?.phone_number || '—' },
    {
      label: 'Tel. emergencia',
      value: `${studentData?.enrollment.emergency_number || '—'}`,
    },
    { label: 'Ciudad', value: studentData?.city || '—' },
    { label: 'Dirección', value: studentData?.address || '—' },
  ];

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
      value: studentData?.school_name || '—',
    },
    {
      label: 'Año escolar',
      value: studentData?.school_year || '—',
    },
  ];

  const tutorData: DataItem[] = !!studentData
    ? [
        { label: 'Parentesco', value: studentData?.tutor_kinship?.name || '—' },
        { label: 'Nombre', value: studentData?.tutor?.name || '—' },
        { label: 'Cédula', value: studentData?.tutor?.id_card || '—' },
        { label: 'Correo', value: studentData?.tutor?.email || '—' },
        { label: 'Teléfono', value: studentData?.tutor?.phone_number || '—' },
        { label: 'Ciudad', value: studentData?.tutor?.city || '—' },
        { label: 'Dirección', value: studentData?.tutor?.address || '—' },
      ]
    : [];

  const handleCourseSaveChanges = async () => {
    if (studentData) {
      await processCourseChanges(
        Number(studentData.id),
        courseSelection,
        studentData,
        navigate,
      );
    }
  };

  const handleEditedTutor = (updatedTutor: Tutor) => {
    setEditedTutor(updatedTutor);
  };

  const updateTutorData = async () => {
    if (!studentData || !editedTutor) {
      showError('No hay datos de tutor para actualizar');
      return;
    }

    const payload = {
      student_id: studentData.id,
      tutor: {
        name: editedTutor.name,
        email: editedTutor.email,
        phone_number: editedTutor.phone_number,
        city: editedTutor.city,
        address: editedTutor.address,
      },
    };

    try {
      const response = await fetch(`${API_URL}/students.update`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Authorization: API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 204) {
        showSuccess('Tutor actualizado correctamente');
        navigate(`/student/${studentData.id}`);
        return true;
      }

      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      console.error('Error al actualizar tutor:', error);
      showError('Error al actualizar tutor');
      return false;
    }
  };

  const prepareStudentUpdateData = (studentData: any) => {
    const {
      id,
      id_card,
      name,
      date_of_birth,
      email,
      city,
      address,
      phone_number,
      school_name,
      school_year,
      enrollment: { emergency_number },
    } = studentData;

    return {
      student_id: id,
      emergency_number,
      id_card,
      name,
      date_of_birth,
      email,
      city,
      address,
      phone_number,
      school_name,
      school_year,
    };
  };

  const [selectTutorData, setSelectTutorData] = useState({
    tutor_kinship: 0,
    tutor_id: 0,
  });

  const updateStudent = async (studentDataUpdated: Student) => {
    const updatePayload = prepareStudentUpdateData(studentDataUpdated);
    try {
      const response = await fetch(`${API_URL}/students.update`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Authorization: `${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      });


      if (response.status === 204) {
        return studentDataUpdated; 
      }

      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      console.error('Error en updateStudent:', {
        error,
        payload: updatePayload,
      });
      throw error;
    }
  };

  const handleSaveChanges = async (section: string) => {
    if (!studentDataUpdated) return;

    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: `Vas a actualizar los datos ${section} del estudiante.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        customClass: {
          popup: 'bg-white text-black dark:bg-boxdark-2 dark:text-white',
          confirmButton:
            'bg-yellow-500 text-white dark:bg-boxdark dark:text-white',
          cancelButton:
            'bg-blue-500 text-white dark:bg-boxdark dark:text-white',
        },
      });

      if (!result.isConfirmed) return;

      try {
        await updateStudent(studentDataUpdated);
        
        
        

      } finally {
        showSuccess(
          `Los datos ${section} se actualizaron correctamente.`,
        );
        navigate(`/student/${studentDataUpdated.id}`);
      }
    } catch (error) {
      console.error(`Error al actualizar ${section}:`, error);

      showError(
        `Error al actualizar los datos ${section}.`);
    }
  };

  useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`${API_URL}/students.kinship.list`, {
            headers: {
              Authorization: API_KEY,
            },
            credentials: 'include',
          });
          const data: Kinship[] = await response.json();
          setKinshipData(data);
        } catch (error) {
          console.error('Error al obtener los datos', error);
        }
      };
      fetchData();
    }, []);
  
    const handleKinshipChange = (kinshipId: number) => {
      setSelectTutorData((prevState) => ({
        ...prevState,
        tutor_kinship: kinshipId,
      }));
    };
  
    const handleTutorSelection = (tutor: Tutor) => {
      setSelectTutorData((prevState) => ({
        ...prevState,
        tutor_id: tutor.id,
      }));
      setSelectedTutor(tutor);
    };
  
    const updateTutor = async () => {
      if (
        !studentData ||
        !selectTutorData.tutor_id ||
        !selectTutorData.tutor_kinship
      ) {
        showError('Debe seleccionar tutor y parentesco');
        return;
      }

      const payload = {
        student_id: studentData.id,
        tutor_id: selectTutorData.tutor_id,
        tutor_kinship: selectTutorData.tutor_kinship,
      };

      try {
        const response = await fetch(`${API_URL}/students.update`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            Authorization: API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.status === 204) {
          showSuccess('Tutor actualizado correctamente');
          // Opcional: recargar o actualizar el estado con nuevo tutor
          navigate(`/student/${studentData.id}`);
          return true;
        }

        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      } catch (error) {
        console.error('Error al actualizar tutor:', error);
        showError('Error al actualizar tutor');
        return false;
      }
    };

  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div
          className={clsx('shadow rounded-md p-6', colorVariants['white'].icon)}
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

          {user?.role === 'admin' && (
            <>
              <hr className="mt-3 mb-3" />
              <div>
                <label className="block text-2xl dark:text-white mb-3">
                  Editar datos personales
                </label>
                <Switcher
                  enabled={switcherPersonalEnabled}
                  onToggle={setSwitcherPersonalEnabled}
                  labelId="togglePersonal"
                />
              </div>

              {switcherPersonalEnabled && (
                <>
                  <FormStudentEdit
                    studentData={studentDataUpdated}
                    onStudentChange={(updated) => {
                      setStudentDataUpdated((prev) => ({
                        ...prev,
                        ...updated,
                      }));
                    }}
                  />
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline me-3 mt-3"
                    onClick={() => handleSaveChanges('personales')}
                  >
                    Guardar
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
          <h3 className="text-2xl font-semibold mb-4">Datos del Tutor</h3>
          {tutorData.map((item) => (
            <div key={item.label} className="grid grid-cols-2 gap-y-4 text-lg">
              <dt className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                {item.label}
              </dt>
              <dd className="text-gray-600 dark:text-gray-400">{item.value}</dd>
            </div>
          ))}
          {user?.role === 'admin' && (
            <>
              <hr className="mt-3 mb-3" />
              <div>
                <label className="block text-2xl dark:text-white mb-3">
                  Editar datos tutor
                </label>
                <Switcher
                  enabled={switcherTutorEnabled}
                  onToggle={setSwitcherTutorEnabled}
                  labelId="toggleTutor"
                />
              </div>

              {switcherTutorEnabled && (
                <>
                  {selectedOption === null ? (
                    <div className="flex justify-center gap-2 xl:gap-7 m-7">
                      <button type="button" className="hidden">
                        hidden
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedOption('search')}
                        className="inline-flex items-center justify-center py-4 px-10 text-black bg-white dark:text-white dark:bg-boxdark dark:hover:bg-black hover:bg-slate-100"
                      >
                        Cambiar tutor
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedOption('form')}
                        className="inline-flex items-center justify-center py-4 px-10 text-black bg-white dark:text-white dark:bg-boxdark dark:hover:bg-black hover:bg-slate-100"
                      >
                        Editar tutor
                      </button>
                    </div>
                  ) : selectedOption === 'search' ? (
                    <>
                      <div className="flex justify-end mb-4">
                        <button
                          onClick={() => {
                            setSelectedOption(null);
                          }}
                          className={clsx(colorVariants['white'].btnSc)}
                        >
                          <FaX size={18} />
                        </button>
                      </div>

                      {!selectedTutor ? (
                        <TableTutorSearch onSelect={handleTutorSelection} />
                      ) : (
                        <CardTutor
                          tutor={selectedTutor}
                          onReset={() => {
                            setSelectedTutor(null);
                            setSelectTutorData({
                              tutor_kinship: 0,
                              tutor_id: 0,
                            });
                          }}
                          color="white"
                        />
                      )}
                      <SelectGroup
                        title="Parentesco"
                        placeholder="Selecciona un parentesco"
                        kinship={kinshipData}
                        onChange={(kinshipId) => handleKinshipChange(kinshipId)}
                      />

                      <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
                        onClick={() => {
                          Swal.fire({
                            title: '¿Estás seguro?',
                            text: 'Vas a cambiar el tutor del estudiante.',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Continuar',
                            cancelButtonText: 'Cancelar',
                            customClass: {
                              popup:
                                'bg-white text-black dark:bg-boxdark-2 dark:text-white',
                              confirmButton:
                                'bg-yellow-500 text-white dark:bg-boxdark dark:text-white',
                              cancelButton:
                                'bg-blue-500 text-white dark:bg-boxdark dark:text-white',
                            },
                          }).then(async (result) => {
                            if (result.isConfirmed) {
                              await updateTutor();
                            }
                          });
                        }}
                      >
                        Guardar Tutor
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-end mb-4">
                        <button
                          onClick={() => setSelectedOption(null)}
                          className={clsx(colorVariants['white'].btnSc)}
                        >
                          <FaX size={18} />
                        </button>
                      </div>

                      <FormTutorEdit
                        initialData={studentData.tutor}
                        onTutorChange={handleEditedTutor}
                      />

                      <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
                        onClick={async () => {
                          const result = await Swal.fire({
                            title: '¿Estás seguro?',
                            text: 'Vas a actualizar los datos del tutor.',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Continuar',
                            cancelButtonText: 'Cancelar',
                            customClass: {
                              popup:
                                'bg-white text-black dark:bg-boxdark-2 dark:text-white',
                              confirmButton:
                                'bg-yellow-500 text-white dark:bg-boxdark dark:text-white',
                              cancelButton:
                                'bg-blue-500 text-white dark:bg-boxdark dark:text-white',
                            },
                          });
                          if (result.isConfirmed) {
                            await updateTutorData();
                          }
                        }}
                      >
                        Guardar Cambios
                      </button>
                    </>
                  )}
                </>
              )}
            </>
          )}
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
            <div key={item.label} className="grid grid-cols-2 gap-y-4 text-lg">
              <dt className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                {item.label}
              </dt>
              <dd className="text-gray-600 dark:text-gray-400">{item.value}</dd>
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
                  enabled={switcherCourseEnabled}
                  onToggle={setSwitcherCourseEnabled}
                  labelId="toggleCourse"
                />
              </div>

              {switcherCourseEnabled && (
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
                        cancelButtonText: 'Cancelar',
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
                              await handleCourseSaveChanges();
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
                    Guardar
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
          <div className="h-[240px]">
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
          {user?.role === 'admin' && (
            <>
              <div className="items-end">
                <hr className="mt-3 mb-3" />
                <div>
                  <label className="block text-2xl dark:text-white mb-3">
                    Editar datos académicos
                  </label>
                  <Switcher
                    enabled={switcherAcademicEnabled}
                    onToggle={setSwitcherAcademicEnabled}
                    labelId="toggleAcademic"
                  />
                </div>

                {switcherAcademicEnabled && (
                  <>
                    <FormAcademicEdit
                      studentData={studentDataUpdated}
                      onAcademicChange={(updated) => {
                        setStudentDataUpdated((prev) => ({
                          ...prev,
                          ...updated,
                        }));
                      }}
                    />
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline me-3 mt-3"
                      onClick={() => {
                        handleSaveChanges('académicos');
                      }}
                    >
                      Guardar
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ListCardsInfo;

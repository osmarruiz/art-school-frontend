import { useState, useEffect } from 'react';
import { FaWallet, FaX } from 'react-icons/fa6';
import CardOperator from '../../components/Cards/CardOperator';
import { Tutor } from '../../types/tutor';
import FormStudent from '../../components/Forms/FormStudent';
import FormCourse from '../../components/Forms/FormCourse';
import FormTutor from '../../components/Forms/FormTutor';
import TableTutor from '../../components/Tables/TableTutorSearch';
import SelectGroup from '../../components/Forms/SelectGroup/SelectGroup';
import clsx from 'clsx';
import { colorVariants } from '../../utils/colorVariants';
import CardTutor from '../../components/Cards/CardTutor';
import { API_KEY, API_URL } from '../../utils/apiConfig';
import { Kinship } from '../../types/kinship';
import useToast from '../../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Enrollment = ({
  color,
}: {
  color: 'violet' | 'white' | 'red' | 'orange' | 'green';
}) => {
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [isSwitchEnabled, setIsSwitchEnabled] = useState(false);
  const { showError, showSuccess } = useToast();
  const [kinshipData, setKinshipData] = useState<Kinship[]>([]);
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<
    null | 'search' | 'form'
  >(null);
  const [courseSelection, setCourseSelection] = useState<
    {
      courseId: number | null;
      shiftId: number | null;
      courseName: string | null;
      shiftName: string;
    }[]
  >([]);
  const [studentData, setStudentData] = useState({
    id_card: '',
    name: '',
    enrollment_date: '',
    date_of_birth: '',
    email: '',
    city: '',
    address: '',
    phone_number: '',
    school_name: '',
    school_year: 0,
    emergency_number: '',
    exonerate: false,
  });

  const [tutorData, setTutorData] = useState({
    id_card: '',
    name: '',
    email: '',
    city: '',
    address: '',
    phone_number: '',
    tutor_kinship: 0,
  });

  const [selectTutorData, setSelectTutorData] = useState({
    tutor_kinship: 0,
    tutor_id: 0,
  });

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    let tutorInfo = {};

    if (tutorData.name !== '' && tutorData.phone_number !== '') {
      /* Required fields.  */
      tutorInfo = {
        tutor_kinship: tutorData.tutor_kinship,
        tutor: {
          id_card: tutorData.id_card,
          name: tutorData.name,
          email: tutorData.email,
          phone_number: tutorData.phone_number,
          city: tutorData.city,
          address: tutorData.address,
        },
      };
    } else if (selectTutorData.tutor_id) {
      tutorInfo = {
        tutor_id: selectTutorData.tutor_id,
        tutor_kinship: selectTutorData.tutor_kinship,
      };
    }

    const courses: { name: string; shift: string }[] = [];

    const payload = {
      emergency_number: studentData.emergency_number || '',
      exonerate: studentData.exonerate || false,
      student: {
        id_card: studentData.id_card,
        name: studentData.name,
        date_of_birth: studentData.date_of_birth,
        email: studentData.email,
        city: studentData.city,
        address: studentData.address,
        phone_number: studentData.phone_number,
        school_name: studentData.school_name || null,
        school_year: studentData.school_year ?? null,
        enrollment_date: studentData.enrollment_date
          ? new Date(studentData.enrollment_date).toISOString().split('T')[0]
          : new Date().toLocaleDateString('en-CA'),
      },
      courses: courseSelection.map((course) => {
        courses.push({
          name: course.courseName ?? '',
          shift: course.shiftName,
        });
        return {
          course_id: course.courseId,
          shift_id: course.shiftId,
        };
      }),
      ...tutorInfo,
    };

    let summary = `
  <div style="text-align: left;">
    <h2 class="text-1xl font-bold mb-1">Curso(s):</h3>
    <ul>
      ${courses
        .map(
          (course) => `
        <li class="ms-1">${course.name} (${course.shift})</li>
      `,
        )
        .join('')}
    </ul>

    <h3 class="text-1xl font-bold mb-1 mt-3">Resumen de Información del Estudiante:</h3>
    <p>Cédula: ${payload.student.id_card || '—'}</p>
    <p>Nombre: ${payload.student.name}</p>
    <p>Fecha de Nacimiento: ${new Date(
      payload.student.date_of_birth + 'T00:00:00-06:00',
    ).toLocaleDateString()}</p>
    <p>Email: ${payload.student.email || '—'}</p>
    <p>Ciudad: ${payload.student.city}</p>
    <p>Dirección: ${payload.student.address}</p>
    <p>Teléfono: ${payload.student.phone_number || '—'}</p>
    <p>Colegio: ${payload.student.school_name || '—'}</p>
    <p>Año Escolar: ${payload.student.school_year || '—'}</p>
    <p>Número de Emergencia: ${payload.emergency_number || '—'}</p>
    <p>Exonerado: ${payload.exonerate ? 'Sí' : 'No'}</p>
`;

    if (tutorData.name !== '' && tutorData.phone_number !== '') {
      summary += `
    <h4 class="text-1xl font-bold mb-1 mt-3">Información del Tutor:</h4>
    <p>Parentesco: ${kinshipData.find((k) => k.id === tutorData.tutor_kinship)
      ?.name}</p>
    <p>Cédula: ${tutorData.id_card || '—'}</p>
    <p>Nombre: ${tutorData.name}</p>
    <p>Email: ${tutorData.email || '—'}</p>
    <p>Teléfono: ${tutorData.phone_number}</p>
    <p>Ciudad: ${tutorData.city}</p>
    <p>Dirección: ${tutorData.address}</p>
  `;
    } else if (selectTutorData.tutor_id) {
      summary += `
    <h4 class="text-1xl font-bold mb-1 mt-3">Información del Tutor:</h4>
    <p>Nombre: ${selectedTutor?.name}</p>
    <p>Parentesco: ${kinshipData.find(
      (k) => k.id === selectTutorData.tutor_kinship,
    )?.name}</p>
  `;
    }

    summary += `</div>`;
    Swal.fire({
      title: '¿Estás seguro?',
      html: summary,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'No, cancelar',
      customClass: {
        popup: 'bg-white text-black dark:bg-boxdark-2 dark:text-white',
        confirmButton: 'bg-blue-500 text-white dark:bg-boxdark text-white',
        cancelButton: 'bg-gray-300 text-black dark:bg-gray-700 text-white',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        (async () => {
          try {
            const response = await fetch(`${API_URL}/students.enroll`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: API_KEY,
              },
              body: JSON.stringify(payload),
              credentials: 'include',
            });

            let data = null;
            try {
              if (
                response.headers
                  .get('Content-Type')
                  ?.includes('application/json')
              ) {
                data = await response.json();
              }
            } catch (error) {
              console.error('Error al analizar JSON:', error);
            }

            if (!response.ok) {
              showError(
                data?.detail || 'Error inesperado',
                data?.hint,
                data?.with.errors,
              );
              return;
            }

            showSuccess('Se registró el estudiante correctamente.', '');

            navigate('/enrollment');
          } catch (error) {
            console.error('Error al enviar datos:', error);
          }
        })();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardOperator
        title="Matricular Estudiante"
        subtitle="Agrega un nuevo estudiante al sistema."
        color="violet"
      >
        <FaWallet size={20} className="text-white" />
        <div>
          <p
            className={clsx(
              'text-3xl font-bold mb-2 ',
              colorVariants[color].text,
            )}
          >
            Curso(s)
          </p>

          <FormCourse onCourseChange={setCourseSelection} />
        </div>

        <div>
          <p
            className={clsx(
              'text-3xl font-bold mb-2',
              colorVariants[color].text,
            )}
          >
            Datos del estudiante
          </p>
          <FormStudent
            onToggle={(e) => {
              setIsSwitchEnabled(e);
              setTutorData({
                id_card: '',
                name: '',
                email: '',
                city: '',
                address: '',
                phone_number: '',
                tutor_kinship: 0,
              });
            }}
            onStudentChange={setStudentData}
          />
          <br />

          {isSwitchEnabled && (
            <>
              <p
                className={clsx(
                  'text-3xl font-bold mb-2 ',
                  colorVariants[color].text,
                )}
              >
                Asociar tutor
              </p>
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
                    Asignar
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedOption('form')}
                    className="inline-flex items-center justify-center py-4 px-10 text-black bg-white dark:text-white dark:bg-boxdark dark:hover:bg-black hover:bg-slate-100"
                  >
                    Registrar
                  </button>
                </div>
              ) : selectedOption === 'search' ? (
                <>
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={() => {
                        setSelectedOption(null);
                        setSelectedTutor(null);
                        setSelectTutorData({
                          tutor_kinship: 0,
                          tutor_id: 0,
                        });
                      }}
                      className={clsx(colorVariants[color].btnSc)}
                    >
                      <FaX size={18} />
                    </button>
                  </div>
                  <div
                    className={clsx('  rounded-lg', colorVariants[color].inp)}
                  >
                    {!selectedTutor ? (
                      <TableTutor onSelect={handleTutorSelection} />
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
                        color="violet"
                      />
                    )}
                    <SelectGroup
                      title="Parentezco"
                      placeholder="Selecciona un parentezco"
                      kinship={kinshipData}
                      onChange={(kinshipId) => handleKinshipChange(kinshipId)}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={() => setSelectedOption(null)}
                      className={clsx(colorVariants[color].btnSc)}
                    >
                      <FaX size={18} />
                    </button>
                  </div>
                  <FormTutor
                    kinship={kinshipData}
                    onTutorChange={setTutorData}
                  />
                </>
              )}
            </>
          )}
        </div>

        <button
          type="submit"
          className={clsx(
            'inline-flex items-center justify-center py-4 px-10 ',
            colorVariants[color].btn,
          )}
        >
          Registrar estudiante
        </button>
      </CardOperator>
    </form>
  );
};

export default Enrollment;

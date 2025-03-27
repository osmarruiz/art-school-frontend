import { useState, useEffect, useCallback } from 'react';
import { FaWallet, FaX } from 'react-icons/fa6';
import CardOperator from '../../components/Cards/CardOperator';
import { Tutor } from '../../types/tutor';
import FormStudent from '../../components/Forms/FormStudent';
import FormCourse from '../../components/Forms/FormCourse';
import FormTutor from '../../components/Forms/FormTutor';
import TableTutor from '../../components/Tables/TableTutor';
import SelectGroupOne from '../../components/Forms/SelectGroup/SelectGroupOne';
import clsx from 'clsx';
import { colorVariants } from '../../types/colorVariants';
import CardTutor from '../../components/Cards/CardTutor';
import { API_KEY, API_URL } from '../../utils/apiConfig';
import { Kinship } from '../../types/kinship';
import useToast from '../../hooks/useToast';
import { useNavigate } from 'react-router-dom';

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
    { courseId: number | null; shiftId: number | null }[]
  >([]);
  const [studentData, setStudentData] = useState({
    id_card: '',
    name: '',
    date_of_birth: '',
    email: '',
    city: '',
    address: '',
    phone_number: '',
    school_name: '',
    school_year: 0,
    emergency_number: '',
  });

  const [tutorData, setTutorData] = useState({
    id_card: '',
    name: '',
    last_name: '',
    email: '',
    city: '',
    address: '',
    phone_number: '',
    emergency_number: '',
    date_of_birth: '',
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
      tutor_kinship: kinshipId, // Actualizamos el valor de kinship con el id seleccionado
    }));
  };

  const handleTutorSelection = (tutor: Tutor) => {
    // Solo se guarda el ID del tutor
    setSelectTutorData((prevState) => ({
      ...prevState,
      tutor_id: tutor.id, // Aquí guardas solo el ID
    }));
    setSelectedTutor(tutor); // Si necesitas guardar el objeto completo
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Determinar si hay que registrar un tutor o no
    let tutorInfo = {};

    if (tutorData.id_card) {
      // Registrar un nuevo tutor
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
      // Asignar un tutor existente
      tutorInfo = {
        tutor_id: selectTutorData.tutor_id,
        tutor_kinship: selectTutorData.tutor_kinship,
      };
    }

    // Construcción del JSON a enviar
    const payload = {
      emergency_number: studentData.emergency_number || '',
      exonerate: false,
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
      },
      courses: courseSelection.map((course) => ({
        course_id: course.courseId,
        shift_id: course.shiftId,
      })),
      ...tutorInfo, // Agregar tutor solo si aplica
    };

    console.log('Payload enviado:', JSON.stringify(payload, null, 2));


    try {
      const response = await fetch(`${API_URL}/students.enroll`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: API_KEY,
          },
          body: JSON.stringify(payload),
          credentials: 'include',
      });

      let data = null;
      try {
        if (
          response.headers.get('Content-Type')?.includes('application/json')
        ) {
          data = await response.json();
        }
      } catch (error) {
        console.error('Error al analizar JSON:', error);
      }

      if (!response.ok) {
        showError(data?.detail || 'Error inesperado');
        return;
      }

      showSuccess('Se registro el estudiante correctamente');

      navigate('/enrollment');
  } catch (error) {
      console.error("Error al enviar datos:", error);
  }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardOperator
        title="Matricular Estudiante"
        subtitle="Asociado a un alumno."
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
            Curso
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
            Estudiante
          </p>
          <FormStudent
            onToggle={setIsSwitchEnabled}
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
                Tutor
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
                    Asignar Tutor
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedOption('form')}
                    className="inline-flex items-center justify-center py-4 px-10 text-black bg-white dark:text-white dark:bg-boxdark dark:hover:bg-black hover:bg-slate-100"
                  >
                    Registrar Tutor
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
                    <SelectGroupOne
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

import { useState, useEffect, useCallback } from 'react';
import { FaWallet, FaX } from 'react-icons/fa6';
import CardOperator from '../../components/Cards/CardOperator';
import { Student } from '../../types/student';
import { Transaction } from '../../types/transaction';
import FormStudent from '../../components/Forms/FormStudent';
import FormCourse from '../../components/Forms/FormCourse';
import FormTutor from '../../components/Forms/FormTutor';
import TutorSearch from '../../components/Search/TutorSearch';
import SelectGroupOne from '../../components/Forms/SelectGroup/SelectGroupOne';
import clsx from 'clsx';
import { colorVariants } from '../../types/colorVariants';
import { FaPlus } from "react-icons/fa6";

const Enrollment = ({
  color,
}: {
  color: 'violet' | 'white' | 'red' | 'orange' | 'green';
}) => {
  const [selectedTutor, setSelectedTutor] = useState<Student | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isSwitchEnabled, setIsSwitchEnabled] = useState(false);
  const [selectedOption, setSelectedOption] = useState<
    null | 'search' | 'form'
  >(null);
  const [courses, setCourses] = useState<number[]>([Date.now()]);

  const addCourseForm = () => {
    setCourses([...courses, Date.now()]); // Agregamos un identificador único
  };

  const removeCourseForm = (id: number) => {
    setCourses(courses.filter((courseId) => courseId !== id));
  };

  const fetchTransactions = useCallback(async () => {
    if (!selectedTutor) return;
    try {
      const response = await fetch(
        `/transactions.list?student_id=${selectedTutor.id}`,
      );
      const data = await response.json();
      setTransactions(
        data.filter((transaction: Transaction) => !transaction.is_finished),
      );
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  }, [selectedTutor]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <form>
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

          {courses.map((id, index) => (
            <FormCourse key={id} onRemove={() => removeCourseForm(id)} isFirst={index === 0}/>
          ))}
          <div className="flex justify-center">
            <button
              onClick={addCourseForm}
              type="button"
              className={clsx(
                'mt-4 items-center justify-center py-4 px-8 text-black bg-white dark:text-white dark:bg-boxdark dark:hover:bg-black hover:bg-slate-100',
                colorVariants,
              )}
            >
              <FaPlus/>
            </button>
          </div>
          <br />
          <p
            className={clsx(
              'text-3xl font-bold mb-2',
              colorVariants[color].text,
            )}
          >
            Estudiante
          </p>
          <FormStudent onToggle={setIsSwitchEnabled} />
        </div>

        <div>
          <p
            className={clsx(
              'text-3xl font-bold mb-2 ',
              colorVariants[color].text,
            )}
          >
            Tutor
          </p>
          {isSwitchEnabled && (
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
                      onClick={() => setSelectedOption(null)}
                      className={clsx(colorVariants[color].btnSc)}
                    >
                      <FaX size={18} />
                    </button>
                  </div>
                  <div
                    className={clsx(
                      '  rounded-lg',
                      colorVariants[color].inp,
                    )}
                  >
                    <TutorSearch onSelect={setSelectedTutor} />
                    <SelectGroupOne
                      title="Parentezco"
                      placeholder="Selecciona un parentezco"
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
                  <FormTutor />
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

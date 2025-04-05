import { useEffect, useState } from 'react';
import SelectGroupOne from './SelectGroup/SelectGroupOne';
import { Course } from '../../types/course';
import { Shift } from '../../types/shift';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { API_URL, API_KEY } from '../../utils/apiConfig';

const FormCourse = ({ onCourseChange }: { onCourseChange: (courses: { courseId: number | null; shiftId: number | null; courseName: string | null; shiftName: string }[]) => void }) => {
  const [courseData, setCourseData] = useState<Course[]>([]);
  const [shiftsMap, setShiftsMap] = useState<Map<number, string>>();
  const [courseForms, setCourseForms] = useState<{ id: number; courseName: string, shiftName: string, selectedCourse: number | null; selectedShift: number | null; shiftOptions: Shift[] }[]>([
    { id: Date.now(), selectedCourse: null, shiftName: "", courseName: "", selectedShift: null, shiftOptions: [] },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(`${API_URL}/courses.list`, {
          headers: {
            Authorization: API_KEY,
          },
          credentials: 'include',
        });
        const courses: Course[] = await response.json();
        setCourseData(courses);

        const ss = new Map<number, string>();
        courses.map(c => {
          if (c.shifts !== null) {
            c.shifts.map(s => ss.set(s.id, s.name))
          }
        })
        setShiftsMap(ss);
      } catch (error) {
        console.error('Error al obtener los datos', error);
      }
    };
    fetchData();
  }, []);

  const addCourseForm = () => {
    setCourseForms([...courseForms, { id: Date.now(), courseName: "", shiftName: "", selectedCourse: null, selectedShift: null, shiftOptions: [] }]);
  };

  const removeCourseForm = (id: number) => {
    if (courseForms.length > 1) {
      setCourseForms(courseForms.filter((form) => form.id !== id));
    }
  };

  const handleCourseChange = (id: number, courseId: number) => {
    const shiftSelector: NodeListOf<HTMLSelectElement> | null = document.querySelectorAll(".shifts-container select");
    if (shiftSelector !== null) {
      shiftSelector.forEach(s => {
        s.selectedIndex = 0;
      });
    }
    let selectedShift = 0;
    let shiftName = "";
    const found = courseData.find((course) => course.id === courseId);
    if (found !== null && found?.shifts !== null) {
      selectedShift = Number(found?.shifts[0].id);
      shiftName = shiftsMap?.get(selectedShift) ?? "";
    }

    setCourseForms((prevForms) =>
      prevForms.map((form) =>
        form.id === id
          ? {
            ...form,
            selectedCourse: courseId,
            shiftOptions: courseData.find((course) => course.id === courseId)?.shifts || [],
            selectedShift: selectedShift,
            courseName: courseData.find((course) => course.id === courseId)?.name || "",
            shiftName: shiftName,
          }
          : form
      )
    );
  };

  const handleShiftChange = (id: number, shiftId: number) => {
    const shiftName = shiftsMap?.get(shiftId) ?? "";
    setCourseForms((prevForms) =>
      prevForms.map((form) =>
        form.id === id ? { ...form, selectedShift: shiftId, shiftName, } : form
      )
    );
  };

  useEffect(() => {
    onCourseChange(
      courseForms.map(({ selectedCourse, selectedShift, courseName, shiftName }) => ({
        courseId: selectedCourse,
        shiftId: selectedShift,
        courseName: courseName,
        shiftName: shiftName,
      }))
    );
  }, [courseForms, onCourseChange]);

  return (
    <div>
      {courseForms.map(({ id, shiftOptions }, index) => (
        <div key={id} className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark my-2 p-6.5 relative">
          {index > 0 && (
            <button onClick={() => removeCourseForm(id)} className="absolute top-2 right-2">
              <FaMinus />
            </button>
          )}
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <SelectGroupOne
                title="Curso"
                placeholder="Selecciona un curso"
                course={courseData}
                onChange={(courseId) => handleCourseChange(id, courseId)}
              />
            </div>
            <div className="w-full xl:w-1/2 shifts-container">
              <SelectGroupOne
                title="Turno"
                placeholder="Selecciona un turno"
                shift={shiftOptions}
                onChange={(shiftId) => handleShiftChange(id, shiftId)}
              />
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-center">
        <button onClick={addCourseForm} type="button" className="mt-4 py-4 px-8 text-black bg-white dark:text-white dark:bg-boxdark dark:hover:bg-black hover:bg-slate-100">
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default FormCourse;

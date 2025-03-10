import { useEffect, useState } from "react";
import SelectGroupOne from "./SelectGroup/SelectGroupOne";
import { course } from "../../types/course";
import { shift } from "../../types/shift";
import { FaMinus } from "react-icons/fa6";

const FormCourse = ({onRemove, isFirst}:{onRemove: () => void; isFirst: boolean}) => {
  const [courseData, setCourseData] = useState<course[]>([]);
  const [_, setSelectedCourse] = useState<number | null>(null);
  const [shiftOptions, setShiftOptions] = useState<shift[]>([]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/courses.list");
        const data: course[] = await response.json();
        setCourseData(data);
      } catch (error) {
        console.error("Error al obtener los datos", error);
      }
    };
    fetchData();
  }, []);

  // Función para manejar la selección del curso
  const handleCourseChange = (courseId: number) => {
    setSelectedCourse(courseId);
    const selected = courseData.find((course) => course.id === courseId);
    
    console.log("Curso seleccionado:", selected); 
    
    setShiftOptions(selected ? selected.shifts : []);
  };

  return (
    <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark my-2">
      
      <div className="p-6.5">
      <div className="flex justify-end">
        {!isFirst &&
        (
          <button 
        onClick={onRemove} 
        className="absolute"
      >
        <FaMinus/>
      </button>
        )
        }
      
      </div>
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          {/* Select de Cursos */}
          <div className="w-full xl:w-1/2">
          
            <SelectGroupOne
              title="Curso"
              placeholder="Selecciona un curso"
              course={courseData}
              onChange={handleCourseChange} 
            />
          </div>

          {/* Select de Turnos (se actualiza dinámicamente) */}
          <div className="w-full xl:w-1/2">
            <SelectGroupOne
              title="Turno"
              placeholder="Selecciona un turno"
              shift={shiftOptions} // Pasar los objetos correctamente
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormCourse;

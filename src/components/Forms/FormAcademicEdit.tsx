import { useEffect, useState } from 'react';
import { Student } from '../../types/student';

type AcademicFormProps = {
  studentData: Student;
  onAcademicChange: (updatedData: Partial<Student>) => void;
};

const FormAcademicEdit = ({
  studentData,
  onAcademicChange,
}: AcademicFormProps) => {
  const [academicData, setAcademicData] = useState({
    school_name: studentData.school_name || '',
    school_year: studentData.school_year || 0,
  });

  // Sincronizar cuando cambian los props
  useEffect(() => {
    setAcademicData({
      school_name: studentData.school_name || '',
      school_year: studentData.school_year || 0,
    });
  }, [studentData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = name === 'school_year' ? parseInt(value) || 0 : value;

    const updated = {
      ...academicData,
      [name]: newValue,
    };

    setAcademicData(updated);
    onAcademicChange({
      school_name: updated.school_name,
      school_year: updated.school_year,
    });
  };

  // Validación del año escolar (1-11)
  const isValidYear =
    academicData.school_year >= 1 && academicData.school_year <= 11;

  return (
    <div className="rounded-lg border border-stroke bg-white shadow-md dark:border-strokedark dark:bg-boxdark p-6 my-2">
      <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
        Datos Académicos
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block mb-1 text-black dark:text-white">
            Nombre de la escuela <span className="text-meta-1">*</span>
          </label>
          <input
            type="text"
            name="school_name"
            value={academicData.school_name}
            onChange={handleInputChange}
            required
            placeholder="Nombre completo de la escuela"
            className="w-full rounded border border-gray-300 py-2 px-4 dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-black dark:text-white">
            Año escolar <span className="text-meta-1">*</span>
          </label>
          <input
            type="number"
            name="school_year"
            value={academicData.school_year || ''}
            onChange={handleInputChange}
            required
            min={1}
            max={11}
            placeholder="1-11"
            className={`w-full rounded border py-2 px-4 dark:bg-form-input dark:text-white ${
              isValidYear
                ? 'border-gray-300 dark:border-form-strokedark'
                : 'border-meta-1'
            }`}
          />
          {!isValidYear && (
            <p className="text-meta-1 text-xs mt-1">
              El año escolar debe estar entre 1 y 11
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormAcademicEdit;

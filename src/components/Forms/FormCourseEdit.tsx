import { useState, useEffect } from 'react';

const FormCourseEdit = ({
  onCourseChange,
  initialData,
}: {
  onCourseChange: (courseData: any) => void;
  initialData?: { school_name: string; school_year: number };
}) => {
  const [courseData, setCourseData] = useState({
    school_name: initialData?.school_name || '',
    school_year: initialData?.school_year || 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCourseData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    onCourseChange(courseData);
  }, [courseData, onCourseChange]);

  return (
    <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="p-6.5">
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Nombre de la escuela <span className="text-meta-1">*</span>
          </label>
          <input
            type="text"
            name="school_name"
            value={courseData.school_name}
            onChange={handleInputChange}
            required
            placeholder="Nombre de la escuela"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>

        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Año de escolaridad <span className="text-meta-1">*</span>
          </label>
          <input
            type="number"
            name="school_year"
            value={courseData.school_year || ''}
            onChange={handleInputChange}
            required
            min={1}
            max={11}
            placeholder="Año de escolaridad"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default FormCourseEdit;

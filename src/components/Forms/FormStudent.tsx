import { useEffect, useState } from 'react';
import Switcher from './Switcher/Switcher';
import DatePickerOne from './DatePicker/DatePickerOne';

const FormStudent = ({
  onToggle,
  onStudentChange,
}: {
  onToggle: (value: boolean) => void;
  onStudentChange: (studentData: any) => void;
}) => {
  const [enabled, setEnabled] = useState(false);
  const [switcherSchoolEnabled, setSwitcherSchoolEnabled] = useState(false);
  const [switcherExonerateEnabled, setSwitcherExonerateEnabled] =
    useState(false);
  const [studentData, setStudentData] = useState({
    id_card: '',
    name: '',
    enrollment_date: new Date().toLocaleDateString(),
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

  const handleToggle = (value: boolean) => {
    setEnabled(value);
    onToggle(value);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setStudentData((prevState) => {
      const updatedData = { ...prevState, [name]: value };
      return updatedData;
    });
  };

  const handleSchoolYearChange = (schoolYear: number) => {
    setStudentData((prevState) => ({
      ...prevState,
      school_year: schoolYear,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setStudentData((prevState) => ({
      ...prevState,
      date_of_birth: date ? date.toISOString().split('T')[0] : '',
    }));
  };

    const handleEnrollmentDateChange = (date: Date | null) => {
    setStudentData((prevState) => ({
      ...prevState,
      enrollment_date: date ? date.toISOString().split('T')[0] : '',
    }));
  };

  function formatInput(input: string) {
    let cleaned = input.replace(/[^0-9a-zA-Z]/g, '');

    if (cleaned.length > 0 && /[a-zA-Z]/.test(cleaned[cleaned.length - 1])) {
      cleaned =
        cleaned.slice(0, -1) + cleaned[cleaned.length - 1].toUpperCase();
    }

    if (cleaned.length >= 13) {
      return cleaned.replace(/^(\d{3})(\d{6})(\d{4})([a-zA-Z])$/, '$1-$2-$3$4');
    }

    return cleaned.replace(/^(\d{3})(\d{6})(\d{4})$/, '$1$2$3');
  }

  const formatPhoneNumber = (input: string) => {
    let cleaned = input.replace(/\D/g, '');

    if (cleaned.startsWith('505')) {
      cleaned = cleaned.slice(3);
    }

    if (cleaned.length < 8) {
      return cleaned;
    }
    return `+505 ${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  };

  useEffect(() => {
    setStudentData((prevState) => ({
      ...prevState,
      exonerate: switcherExonerateEnabled,
    }));
  }, [switcherExonerateEnabled]);

  useEffect(() => {
    onStudentChange(studentData);
  }, [studentData, onStudentChange]);

  return (
    <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="p-6.5">
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Fecha de matriculación
          </label>
          <DatePickerOne
            onDateChange={handleEnrollmentDateChange}
            name="enrollment_date"
            value={studentData.enrollment_date}
          />
        </div>

        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Nombres y apellidos <span className="text-meta-1">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={studentData.name}
            onChange={handleInputChange}
            required
            placeholder="Ingresa los nombres y apellidos"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>

        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Cédula
          </label>
          <input
            type="text"
            name="id_card"
            value={studentData.id_card}
            onChange={(e) => {
              const formattedValue = formatInput(e.target.value);
              setStudentData({ ...studentData, id_card: formattedValue });
            }}
            minLength={16}
            maxLength={16}
            placeholder="Ingresa la cédula Ej: 0001111112222A"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>

        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Fecha de nacimiento <span className="text-meta-1">*</span>
          </label>
          <DatePickerOne
            onDateChange={handleDateChange}
            name="date_of_birth"
            value={studentData.date_of_birth}
          />
        </div>

        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Departamento <span className="text-meta-1">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={studentData.city}
            onChange={handleInputChange}
            required
            placeholder="Ingresa el departamento"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>

        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Dirección <span className="text-meta-1">*</span>
          </label>
          <textarea
            name="address"
            value={studentData.address}
            onChange={handleInputChange}
            rows={6}
            required
            placeholder="Ingresa la dirección"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          ></textarea>
        </div>

        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Correo Electrónico
          </label>
          <input
            type="email"
            name="email"
            value={studentData.email}
            onChange={handleInputChange}
            placeholder="Ingresa el correo electrónico"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>

        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Número telefónico <span className="text-meta-1">*</span>
          </label>
          <input
            type="tel"
            name="phone_number"
            value={studentData.phone_number}
            onChange={(e) => {
              const formattedValue = formatPhoneNumber(e.target.value);
              setStudentData({ ...studentData, phone_number: formattedValue });
            }}
            placeholder="Ej: 87656859"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            minLength={8}
            maxLength={13}
            required
            title="Ingrese un número de 8 dígitos"
          />
        </div>

        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Número de emergencia
          </label>
          <input
            type="tel"
            name="emergency_number"
            value={studentData.emergency_number}
            onChange={(e) => {
              const formattedValue = formatPhoneNumber(e.target.value);
              setStudentData({
                ...studentData,
                emergency_number: formattedValue,
              });
            }}
            placeholder="Ej: 87656859"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            minLength={8}
            maxLength={13}
            title="Ingrese un número de 8 dígitos"
          />
        </div>

        <div className="mb-4.5 block sm:flex gap-7">
          <div>
            <label className="mb-2.5 block text-black dark:text-white ">
              Asignar o registrar tutor
            </label>
            <Switcher
              enabled={enabled}
              onToggle={handleToggle}
              labelId="toggleTutor"
            />
          </div>
          <div>
            <label className="mb-2.5 block text-black dark:text-white ">
              Registrar datos académicos
            </label>
            <Switcher
              enabled={switcherSchoolEnabled}
              onToggle={setSwitcherSchoolEnabled}
              labelId="toggleSchool"
            />
          </div>
          <div>
            <label className="mb-2.5 block text-black dark:text-white ">
              Exonerar matrícula
            </label>
            <Switcher
              enabled={switcherExonerateEnabled}
              onToggle={setSwitcherExonerateEnabled}
              labelId="toggleExonarate"
            />
          </div>
        </div>

        {switcherSchoolEnabled && (
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Nombre de la escuela <span className="text-meta-1">*</span>
            </label>
            <input
              type="text"
              name="school_name"
              value={studentData.school_name}
              onChange={handleInputChange}
              required
              placeholder="Nombre de la escuela"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
        )}

        {switcherSchoolEnabled && (
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Año de escolaridad <span className="text-meta-1">*</span>
            </label>
            <input
              type="number"
              name="school_year"
              min={1}
              max={11}
              value={studentData.school_year || ''}
              onChange={(e) => handleSchoolYearChange(Number(e.target.value))}
              required
              placeholder="Año de escolaridad"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FormStudent;

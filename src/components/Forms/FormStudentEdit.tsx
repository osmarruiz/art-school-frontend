import { useEffect, useState } from 'react';
import DatePickerOne from './DatePicker/DatePickerOne';
import { Enrollment } from '../../types/enrollment';

type StudentData = {
  id_card: string;
  date_of_birth: string;
  email: string;
  phone_number: string;
  enrollment: Enrollment;
  city: string;
  address: string;
};

const FormStudentEdit = ({
  preload,
  onStudentChange,
}: {
  preload?: StudentData;
  onStudentChange: (updated: StudentData) => void;
}) => {
  const [studentData, setStudentData] = useState<StudentData>({
    id_card: '',
    date_of_birth: '',
    email: '',
    phone_number: '',
    enrollment: {} as Enrollment,
    city: '',
    address: '',
  });

  // Inicializar datos desde preload si existe
  useEffect(() => {
    if (preload) {
        console.log('Preload data:', preload);
      setStudentData(preload);
    }
  }, [preload]);

  const formatIdCard = (input: string) => {
    let cleaned = input.replace(/[^0-9a-zA-Z]/g, '');

    if (cleaned.length > 0 && /[a-zA-Z]/.test(cleaned[cleaned.length - 1])) {
      cleaned =
        cleaned.slice(0, -1) + cleaned[cleaned.length - 1].toUpperCase();
    }

    if (cleaned.length >= 13) {
      return cleaned.replace(/^(\d{3})(\d{6})(\d{4})([a-zA-Z])$/, '$1-$2-$3$4');
    }

    return cleaned.replace(/^(\d{3})(\d{6})(\d{4})$/, '$1$2$3');
  };

  const formatPhone = (input: string) => {
    let cleaned = input.replace(/\D/g, '');
    if (cleaned.startsWith('505')) cleaned = cleaned.slice(3);
    if (cleaned.length < 8) return cleaned;
    return `+505 ${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const formattedValue =
      name === 'id_card'
        ? formatIdCard(value)
        : name === 'phone_number'
        ? formatPhone(value)
        : value;

    const updated = { ...studentData, [name]: formattedValue };
    setStudentData(updated);
    onStudentChange(updated);
  };

  const handleDateChange = (date: Date | null) => {
    const updated = {
      ...studentData,
      date_of_birth: date ? date.toISOString().split('T')[0] : '',
    };
    setStudentData(updated);
    onStudentChange(updated);
  };

  return (
    <div className="rounded-lg border border-stroke bg-white shadow-md dark:border-strokedark dark:bg-boxdark p-6 my-2">
      <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
        Datos Personales
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-black dark:text-white">Cédula</label>
          <input
            type="text"
            name="id_card"
            value={studentData.id_card || ''}
            onChange={handleChange}
            maxLength={16}
            placeholder="Ej: 0001111112222A"
            className="w-full rounded border border-gray-300 py-2 px-4 dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-black dark:text-white">Fecha de nacimiento</label>
          <DatePickerOne
            onDateChange={handleDateChange}
            name="date_of_birth"
            value={studentData.date_of_birth || ''}
          />
        </div>

        <div>
          <label className="block mb-1 text-black dark:text-white">Correo electrónico</label>
          <input
            type="email"
            name="email"
            value={studentData.email}
            onChange={handleChange}
            placeholder="Ingresa el correo"
            className="w-full rounded border border-gray-300 py-2 px-4 dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-black dark:text-white">Teléfono</label>
          <input
            type="tel"
            name="phone_number"
            value={studentData.phone_number || ''}
            onChange={handleChange}
            placeholder="Ej: +505 1234-5678"
            className="w-full rounded border border-gray-300 py-2 px-4 dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
        </div>
        <div>
          <label className="block mb-1 text-black dark:text-white">Teléfono de emergencia</label>
          <input
            type="tel"
            name="phone_number"
            value={studentData.enrollment.emergency_number || ''}
            onChange={handleChange}
            placeholder="Ej: +505 1234-5678"
            className="w-full rounded border border-gray-300 py-2 px-4 dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-black dark:text-white">Ciudad</label>
          <input
            type="text"
            name="city"
            value={studentData.city || ''}
            onChange={handleChange}
            placeholder="Ciudad o departamento"
            className="w-full rounded border border-gray-300 py-2 px-4 dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1 text-black dark:text-white">Dirección</label>
          <textarea
            name="address"
            value={studentData.address || ''}
            onChange={handleChange}
            rows={3}
            placeholder="Dirección completa"
            className="w-full rounded border border-gray-300 py-2 px-4 dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default FormStudentEdit;

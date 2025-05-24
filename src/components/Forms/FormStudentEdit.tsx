import { useEffect, useState } from 'react';
import DatePickerOne from './DatePicker/DatePicker';
import { Student } from '../../types/student';

type StudentFormProps = {
  studentData: Student;
  onStudentChange: (updatedData: Partial<Student>) => void;
};

const FormStudentEdit = ({
  studentData,
  onStudentChange,
}: StudentFormProps) => {
  const [formData, setFormData] = useState({
    id_card: studentData.id_card || '',
    date_of_birth: studentData.date_of_birth || '',
    email: studentData.email || '',
    phone_number: studentData.phone_number || '',
    city: studentData.city || '',
    address: studentData.address || '',
    emergency_number: studentData.enrollment.emergency_number || '',
  });

  // Sincronizar cuando cambian los props
  useEffect(() => {
    setFormData({
      id_card: studentData.id_card || '',
      date_of_birth: studentData.date_of_birth || '',
      email: studentData.email || '',
      phone_number: studentData.phone_number || '',
      city: studentData.city || '',
      address: studentData.address || '',
      emergency_number: studentData.enrollment.emergency_number || '',
    });
  }, [studentData]);

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const formattedValue =
      name === 'id_card'
        ? formatIdCard(value)
        : name === 'phone_number' || name === 'emergency_number'
          ? formatPhone(value)
          : value;

    const updated = { ...formData, [name]: formattedValue };
    setFormData(updated);

    // Notificar cambios al componente padre
    if (name === 'emergency_number') {
      onStudentChange({
        enrollment: {
          ...studentData.enrollment,
          emergency_number: formattedValue,
        },
      });
    } else {
      onStudentChange({ [name]: formattedValue });
    }
  };

  const handleDateChange = (date: Date | null) => {
    const dateValue = date ? date.toISOString().split('T')[0] : '';
    setFormData((prev) => ({ ...prev, date_of_birth: dateValue }));
    onStudentChange({ date_of_birth: dateValue });
  };

  return (
    <div className="rounded-lg border border-stroke bg-white shadow-md dark:border-strokedark dark:bg-boxdark p-6 my-2">
      <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
        Datos Personales
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-black dark:text-white">
            Cédula
          </label>
          <input
            type="text"
            name="id_card"
            value={formData.id_card}
            onChange={handleInputChange}
            maxLength={16}
            placeholder="Ej: 0001111112222A"
            className="w-full rounded border border-gray-300 py-2 px-4 dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-black dark:text-white">
            Fecha de nacimiento
          </label>
          <DatePickerOne
            onDateChange={handleDateChange}
            name="date_of_birth"
            value={formData.date_of_birth}
          />
        </div>

        <div>
          <label className="block mb-1 text-black dark:text-white">
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Ingresa el correo"
            className="w-full rounded border border-gray-300 py-2 px-4 dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-black dark:text-white">
            Teléfono
          </label>
          <input
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            placeholder="Ej: +505 1234-5678"
            className="w-full rounded border border-gray-300 py-2 px-4 dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-black dark:text-white">
            Teléfono de emergencia
          </label>
          <input
            type="tel"
            name="emergency_number"
            value={formData.emergency_number}
            onChange={handleInputChange}
            placeholder="Ej: +505 1234-5678"
            className="w-full rounded border border-gray-300 py-2 px-4 dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-black dark:text-white">
            Ciudad
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="Ciudad o departamento"
            className="w-full rounded border border-gray-300 py-2 px-4 dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1 text-black dark:text-white">
            Dirección
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
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

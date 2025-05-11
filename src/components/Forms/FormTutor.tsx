import { useEffect, useState } from 'react';
import { Kinship } from '../../types/kinship';
import SelectGroupOne from './SelectGroup/SelectGroupOne';

const FormTutor: React.FC<{
  kinship: Kinship[];
  onTutorChange: (studentData: any) => void;
}> = ({ kinship, onTutorChange }) => {
  const [tutorData, setTutorData] = useState({
    id_card: '',
    name: '',
    email: '',
    city: '',
    address: '',
    phone_number: '',
    tutor_kinship: 0,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setTutorData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleKinshipChange = (kinshipId: number) => {
    setTutorData((prevState) => ({
      ...prevState,
      tutor_kinship: kinshipId,
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
    onTutorChange(tutorData);
  }, [tutorData, onTutorChange]);

  return (
    <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="p-6.5">
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Nombres y apellidos <span className="text-meta-1">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={tutorData.name}
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
            value={tutorData.id_card}
            onChange={(e) => {
              const formattedValue = formatInput(e.target.value);
              setTutorData({ ...tutorData, id_card: formattedValue });
            }}
            placeholder="Ingresa la cédula Ej: 0001111112222A"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>

        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Departamento <span className="text-meta-1">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={tutorData.city}
            onChange={handleInputChange}
            required
            placeholder="Ingresa el departamento"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>

        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Dirección <span className="text-meta-1">*</span>
          </label>
          <textarea
            name="address"
            value={tutorData.address}
            onChange={handleInputChange}
            rows={6}
            required
            placeholder="Ingresa la dirección"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          ></textarea>
        </div>

        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Correo Electrónico
          </label>
          <input
            type="email"
            name="email"
            value={tutorData.email}
            onChange={handleInputChange}
            placeholder="Ingresa el correo electrónico"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>

        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Número telefónico <span className="text-meta-1">*</span>
          </label>
          <input
            type="tel"
            name="phone_number"
            value={tutorData.phone_number}
            onChange={(e) => {
              const formattedValue = formatPhoneNumber(e.target.value);
              setTutorData({ ...tutorData, phone_number: formattedValue });
            }}
            minLength={8}
            maxLength={13}
            required
            title="Ingrese un número de 8 dígitos"
            placeholder="Ej: 87656859"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>

        <div className="mb-4.5">
          <SelectGroupOne
            title="Parentezco"
            placeholder="Selecciona un parentezco"
            kinship={kinship}
            onChange={(kinshipId) => handleKinshipChange(kinshipId)}
          />
        </div>
      </div>
    </div>
  );
};

export default FormTutor;

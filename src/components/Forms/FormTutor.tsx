import DatePickerOne from './DatePicker/DatePickerOne';
import SelectGroupOne from './SelectGroup/SelectGroupOne';

const FormStudent = () => {
  return (
    <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="p-6.5">
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <div className="w-full xl:w-1/2">
            <label className="mb-2.5 block text-black dark:text-white">
              Nombres <span className="text-meta-1">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ingresa los nombres"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="w-full xl:w-1/2">
            <label className="mb-2.5 block text-black dark:text-white">
              Apellidos <span className="text-meta-1">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ingresa los apellidos"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
        </div>

        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            C&eacute;dula <span className="text-meta-1">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Ingresa la c&eacute;dula Ej: 0001111112222A"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>

        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Fecha de nacimiento <span className="text-meta-1">*</span>
          </label>
          <DatePickerOne />
        </div>

        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Departamento <span className="text-meta-1">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Ingresa el departamento"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>

        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Direcci&oacute;n <span className="text-meta-1">*</span>
          </label>
          <textarea
            rows={6}
            required
            placeholder="Ingresa la direcci&oacute;n"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          ></textarea>
        </div>
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Correo Electr&oacute;nico <span className="text-meta-1">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Ingresa el correo electr&oacute;nico"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            N&uacute;mero tel&eacute;fonico{' '}
            <span className="text-meta-1">*</span>
          </label>
          <input
            type="tel"
            placeholder="Ej: 87656859"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition 
  focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter 
  dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            inputMode="numeric"
            pattern="\+505\d{8}"
            onInput={(e) => {
              const input = e.target as HTMLInputElement;
              // Asegura que el valor comience con "+505" y limita la longitud a 13 caracteres
              if (!input.value.startsWith('+505')) {
                input.value = '+505' + input.value.replace(/^(\+505)?/, '');
              }
              if (input.value.length > 13) {
                input.value = input.value.substring(0, 13); // Limitar a 13 caracteres
              }
              input.setCustomValidity('');
            }}
            required
            title="Ingrese un número de 8 dígitos"
          />
        </div>
        <div className="mb-4.5"></div>
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            N&uacute;mero de emergencia <span className="text-meta-1">*</span>
          </label>
          <input
            type="tel"
            placeholder="Ej: 87656859"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition 
  focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter 
  dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            inputMode="numeric"
            pattern="\+505\d{8}"
            onInput={(e) => {
              const input = e.target as HTMLInputElement;
              // Asegura que el valor comience con "+505" y limita la longitud a 13 caracteres
              if (!input.value.startsWith('+505')) {
                input.value = '+505' + input.value.replace(/^(\+505)?/, '');
              }
              if (input.value.length > 13) {
                input.value = input.value.substring(0, 13); // Limitar a 13 caracteres
              }
              input.setCustomValidity('');
            }}
            required
            title="Ingrese un número de 8 dígitos"
          />
        </div>
        <div className="mb-4.5">
        <SelectGroupOne
              title="Parentezco"
              placeholder="Selecciona un parentezco"
            />
        </div>
      </div>
    </div>
  );
};

export default FormStudent;

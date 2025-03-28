import flatpickr from "flatpickr";
import { useState, useEffect, useRef } from "react";

const WeekPicker = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const flatpickrInstance = useRef<flatpickr.Instance | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<string>(""); // Inicializar como cadena vacía

  useEffect(() => {
    if (!inputRef.current) return;

    // Si ya hay una semana guardada en sessionStorage, la cargamos
    const storedWeek = sessionStorage.getItem("selectedWeek");
    if (storedWeek) {
      setSelectedWeek(storedWeek);
    }

    flatpickrInstance.current = flatpickr(inputRef.current, {
      mode: "single",
      static: true,
      dateFormat: "Y-W",
      weekNumbers: true,
      onChange: (selectedDates) => {
        if (selectedDates.length > 0) {
          const selectedDate = selectedDates[0];
          const formattedDate = `${selectedDate.getFullYear()}-W${getISOWeek(selectedDate)}`;
          setSelectedWeek(formattedDate);
          // Al seleccionar una semana, guardamos solo ese valor
          sessionStorage.setItem("selectedWeek", formattedDate);
        }
      },
    });

    return () => {
      flatpickrInstance.current?.destroy();
    };
  }, []);

  // Función para obtener la semana ISO correcta
  const getISOWeek = (date: Date) => {
    const tempDate = new Date(date.getTime());
    tempDate.setHours(0, 0, 0, 0);
    tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7)); // Ajuste a jueves
    const yearStart = new Date(tempDate.getFullYear(), 0, 1);
    return Math.ceil(((tempDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        required
        className=" w-full rounded border-[1.5px] border-stroke bg-transparent px-2.5 py-2.5 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        placeholder="Seleccionar semana"
        value={selectedWeek}
        readOnly
      />
    </div>
  );
};

export default WeekPicker;
``

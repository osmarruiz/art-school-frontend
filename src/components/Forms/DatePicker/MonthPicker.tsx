import flatpickr from "flatpickr";
import { useState, useEffect, useRef } from "react";
import { Spanish } from "flatpickr/dist/l10n/es.js"; // Si necesitas soporte en español

const MonthPicker = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const flatpickrInstance = useRef<flatpickr.Instance | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  useEffect(() => {
    if (!inputRef.current) return;

    // Si ya hay un mes guardado en sessionStorage, lo cargamos
    const storedMonth = sessionStorage.getItem("selectedMonth");
    if (storedMonth) {
      setSelectedMonth(storedMonth);
    }

    flatpickrInstance.current = flatpickr(inputRef.current, {
      mode: "single",
      static: true,
      disableMobile: true,
      dateFormat: "Y-m", // Asegúrate de que el formato sea YYYY-MM
      locale: Spanish, // Configuración regional para español (opcional)
      onChange: (selectedDates) => {
        if (selectedDates.length > 0) {
          const selectedDate = selectedDates[0];
          const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}`;
          setSelectedMonth(formattedDate);
          // Al seleccionar un mes, guardamos solo ese valor
          sessionStorage.setItem("selectedMonth", formattedDate);
        }
      },
    });

    return () => {
      flatpickrInstance.current?.destroy();
    };
  }, []);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        required
        className=" w-full rounded border-[1.5px] border-stroke bg-transparent px-2.5 py-2.5 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        placeholder="Seleccionar mes"
        value={selectedMonth}
        readOnly
      />
    </div>
  );
};

export default MonthPicker;

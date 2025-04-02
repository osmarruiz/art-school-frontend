import flatpickr from "flatpickr";
import { useState, useEffect, useRef } from "react";

const DatePickerOne = ({ onDateChange, name, value }: { onDateChange?: (date: Date | null) => void; name: string; value: string }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const flatpickrInstance = useRef<flatpickr.Instance | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(value); 

  useEffect(() => {
    if (!inputRef.current) return;

    flatpickrInstance.current = flatpickr(inputRef.current, {
      mode: "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "m/d/Y",
      prevArrow:
        '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
      nextArrow:
        '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
      onChange: (selectedDates) => {
        const date = selectedDates[0];
        if (onDateChange) {
          onDateChange(date); 
        }
        setSelectedDate(date ? date.toLocaleDateString() : ''); 
      },
    });

    return () => {
      flatpickrInstance.current?.destroy(); 
    };
  }, [onDateChange]);

  useEffect(() => {
    if (flatpickrInstance.current) {
      flatpickrInstance.current.setDate(selectedDate, false); 
    }
  }, [selectedDate]); 

  return (
    <div className="relative">
      <input
        ref={inputRef}
        required
        name={name}
        className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-2.5 py-2.5 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        placeholder="mm/dd/yyyy"
        value={selectedDate} 
        onChange={(e) => setSelectedDate(e.target.value)} 
      />

      <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
        <svg
          width="16"
          height="16"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.7504 2.9812H14.2879V2.36245C14.2879 2.02495 14.0066 1.71558 13.641 1.71558C13.2754 1.71558 12.9941 1.99683 12.9941 2.36245V2.9812H4.97852V2.36245C4.97852 2.02495 4.69727 1.71558 4.33164 1.71558C3.96602 1.71558 3.68477 1.99683 3.68477 2.36245V2.9812H2.25039C1.29414 2.9812 0.478516 3.7687 0.478516 4.75308V14.5406C0.478516 15.4968 1.26602 16.3125 2.25039 16.3125H15.7504C16.7066 16.3125 17.5223 15.525 17.5223 14.5406V4.72495C17.5223 3.7687 16.7066 2.9812 15.7504 2.9812ZM1.77227 8.21245H4.16289V10.9968H1.77227V8.21245ZM5.42852 8.21245H8.38164V10.9968H5.42852V8.21245ZM8.38164 12.2625V15.0187H5.42852V12.2625H8.38164V12.2625ZM9.64727 12.2625H12.6004V15.0187H9.64727V12.2625ZM9.64727 10.9968V8.21245H12.6004V10.9968H9.64727ZM13.8379 8.21245H16.2285V10.9968H13.8379V8.21245ZM2.25039 4.24683H3.71289V4.83745C3.71289 5.17495 3.99414 5.48433 4.35977 5.48433C4.72539 5.48433 5.00664 5.20308 5.00664 4.83745V4.24683H13.0504V4.83745C13.0504 5.17495 13.3316 5.48433 13.6973 5.48433C14.0629 5.48433 14.3441 5.20308 14.3441 4.83745V4.24683H15.7504C16.0316 4.24683 16.2504 4.46568 16.2504 4.75308V6.63745H2.25039V4.75308C2.25039 4.46568 2.46922 4.24683 2.25039 4.24683Z"
            fill="#333"
          />
        </svg>
      </div>
    </div>
  );
};

export default DatePickerOne;

import flatpickr from 'flatpickr';
import { useState, useEffect, useRef } from 'react';

const DatePickerOne = ({
  onDateChange,
  name,
  value,
}: {
  onDateChange?: (date: Date | null) => void;
  name: string;
  value: string;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const flatpickrInstance = useRef<flatpickr.Instance | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(value);

  useEffect(() => {
    if (!inputRef.current) return;

    flatpickrInstance.current = flatpickr(inputRef.current, {
      mode: 'single',
      static: true,
      monthSelectorType: 'static',
      dateFormat: 'm/d/Y',
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
        
      </div>
    </div>
  );
};

export default DatePickerOne;

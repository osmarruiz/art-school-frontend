import React, { useState } from 'react';
import { Course } from '../../../types/course';
import { Shift } from '../../../types/shift';
import { Kinship } from '../../../types/kinship';

interface SelectProps {
  title?: string;
  placeholder: string;
  course?: Course[];
  shift?: Shift[];
  kinship?: Kinship[];
  onChange?: (value: number) => void;
}

const SelectGroupOne: React.FC<SelectProps> = ({
  title,
  course,
  placeholder,
  shift,
  kinship,
  onChange,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | number>('');

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(event.target.value);
    setSelectedOption(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="">
      {title && (
        <label className="mb-2.5 block text-black dark:text-white">
          {title} <span className="text-meta-1">*</span>
        </label>
      )}

      <div className="relative z-20  bg-transparent dark:bg-form-input">
        <select
          value={selectedOption}
          required
          onChange={handleSelectChange}
          className={`relative z-20 w-full  appearance-none rounded border border-stroke bg-white py-2.5 pl-4 pr-8 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
            selectedOption
              ? 'text-black dark:text-white'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {Array.isArray(course) &&
            course.map((item) => (
              <option
                key={item.id}
                value={item.id}
                className="text-black dark:text-white"
              >
                {item.name}
              </option>
            ))}
          {Array.isArray(shift) &&
            shift.map((item) => (
              <option
                key={item.id}
                value={item.id}
                className="text-black dark:text-white"
              >
                {item.name}
              </option>
            ))}
          {Array.isArray(kinship) &&
            kinship.map((item) => (
              <option
                key={item.id}
                value={item.id}
                className="text-black dark:text-white"
              >
                {item.name}
              </option>
            ))}
        </select>

        <span className="absolute top-1/2 right-2 z-30 -translate-y-1/2">
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.8">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                fill=""
              ></path>
            </g>
          </svg>
        </span>
      </div>
    </div>
  );
};

export default SelectGroupOne;

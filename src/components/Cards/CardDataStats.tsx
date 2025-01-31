import React, { ReactNode } from 'react';

interface CardDataStatsProps {
  title: string;
  total?: string;
  rate?: string;
  levelUp?: boolean;
  levelDown?: boolean;
  children: ReactNode;
  color?: 'violet' | 'white' | 'red' | 'orange' | 'green'; // Prop para el color
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  rate = null,
  levelUp = null,
  levelDown = null,
  children,
  color = 'white', // Color por defecto 'violet'
}) => {
  // Define colores en función del prop `color`
  const bgColorClasses = {
    violet: 'bg-violet-100 dark:bg-violet-900',
    white: 'bg-white dark:bg-boxdark',
    red: 'bg-red-100 dark:bg-red-900',
    orange: 'bg-orange-100 dark:bg-orange-900',
    green: 'bg-green-100 dark:bg-green-900',
  };

  const iconBgClasses = {
    violet: 'bg-violet-900 dark:bg-violet-700',
    white: 'bg-meta-2 dark:bg-meta-4',
    red: 'bg-red-500 dark:bg-red-700',
    orange: 'bg-orange-500 dark:bg-orange-700',
    green: 'bg-green-500 dark:bg-green-700',
  };

  const textColorClasses = {
    violet: 'text-black dark:text-white',
    white: 'text-black dark:text-white',
    red: 'text-black dark:text-white',
    orange: 'text-black dark:text-white',
    green: 'text-black dark:text-white',
  };

  const rateColorClasses = {
    violet: 'text-meta-3',
    white: 'text-meta-3',
    red: 'text-meta-5',
    orange: 'text-meta-5',
    green: 'text-meta-5',
  };

  return (
    <div className={`rounded-sm border border-stroke bg- dark:border-strokedark py-6 px-7.5 shadow-default ${bgColorClasses[color]}`}>
      <div className={`flex h-11.5 w-11.5 items-center justify-center rounded-full ${iconBgClasses[color]}`}>
        {children}
      </div>

      <div className="mt-4 pt-4 flex items-end justify-between">
        <div>
          <h4 className={`text-title-md font-bold ${textColorClasses[color]}`}>
            {total}
          </h4>
          <span className={`text-s font-medium ${textColorClasses[color]}`}>{title}</span>
        </div>

        <span
          className={`flex items-center gap-1 text-sm font-medium ${
            levelUp && rateColorClasses[color]
          } ${levelDown && 'text-meta-5'}`}
        >
          {rate}

          {levelUp && (
            <svg
              className={`fill-${rateColorClasses[color]}`}
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
                fill=""
              />
            </svg>
          )}
          {levelDown && (
            <svg
              className="fill-meta-5"
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.64284 7.69237L9.09102 4.33987L10 5.22362L5 10.0849L-8.98488e-07 5.22362L0.908973 4.33987L4.35716 7.69237L4.35716 0.0848701L5.64284 0.0848704L5.64284 7.69237Z"
                fill=""
              />
            </svg>
          )}
        </span>
      </div>
    </div>
  );
};

export default CardDataStats;

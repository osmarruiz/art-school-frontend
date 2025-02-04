import React, { ReactNode } from 'react';

interface CardDataStatsProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  color?: 'violet' | 'white' | 'red' | 'orange' | 'green'; // Prop para el color
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  subtitle,
  children,
  color = 'white',
}) => {
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


  const childrenArray = React.Children.toArray(children);

  return (
    <div
      className={`rounded-sm border border-stroke dark:border-strokedark py-6 px-7.5 shadow-default ${bgColorClasses[color]}`}
    >
      <div className="flex items-center">
        <div
          className={`flex h-11.5 w-11.5 items-center justify-center rounded-full ${iconBgClasses[color]}`}
        >
          {childrenArray[0]}
        </div>
        <div className="pl-7">
          <p className={`text-s font-medium ${textColorClasses[color]}`}>
            {title}
          </p>
          <p className={`text-sm font-light ${textColorClasses[color]}`}>
            {subtitle}
          </p>
        </div>
        <div className="ml-auto">
          <a href="/operator">
          <div
            className={`flex h-8.5 w-8.5 items-center justify-center rounded-full ${iconBgClasses[color]}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-arrow-left fill-white"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
              />
            </svg>
          </div>
          </a>
        </div>
      </div>

      <div className={`mt-4 pt-4 h-100 block text-white ${iconBgClasses[color]}`}>
      <p className={`pl-7 text-3xl font-bold`}>
            Estudiante
          </p>
        {childrenArray[1]}
      </div>
      <div className={`mt-4 pt-4 h-100 flex text-white ${iconBgClasses[color]}`}>
        <div className="block pl-7" >
      <p className={`text-3xl font-bold`}>
            Transacciones
          </p>
          <p className={`text-sm font-light }`}>
            Selecciona un alumno antes de comenzar
          </p>
        {childrenArray[2]}
      </div>
      </div>
      <div className={`mt-4 flex  justify-end gap-3 align-middle`}>
      <button className={`inline-flex items-center justify-center ${iconBgClasses[color]} py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10`}>
              Comenzar Transacción
      </button>
      </div>
    </div>
  );
};

export default CardDataStats;

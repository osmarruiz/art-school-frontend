import React, { ReactNode } from 'react';
import clsx from 'clsx';
import { colorVariants } from '../../types/colorVariants';
import { FaArrowLeft } from 'react-icons/fa6';

interface CardDataStatsProps {
  title: string;
  subtitle: string;
  children: ReactNode[];
  color?: 'violet' | 'white' | 'red' | 'orange' | 'green';
}

const CardOperator: React.FC<CardDataStatsProps> = ({
  title,
  subtitle,
  children,
  color = 'white',
}) => {
  return (
    <div
      className={clsx(
        'rounded-sm  py-6 px-7.5 shadow-default',
        colorVariants[color].bg,
      )}
    >
      {/* Header */}
      <div className="flex items-center">
        <div
          className={clsx(
            'flex h-11.5 w-11.5 items-center justify-center rounded-full',
            colorVariants[color].icon,
          )}
        >
          {children[0]}
        </div>
        <div className="pl-7">
          <p className={'text-s font-medium text-black dark:text-white'}>
            {title}
          </p>
          <p className={'text-sm font-light text-black dark:text-white'}>
            {subtitle}
          </p>
        </div>
        <div className="ml-auto">
          <a href="/operator">
            <div
              className={clsx(
                'flex h-8.5 w-8.5 items-center justify-center rounded-full',
                colorVariants[color].icon,
              )}
            >
              <FaArrowLeft size={20} className="text-white" />
            </div>
          </a>
        </div>
      </div>

      {/* Contenido */}
      <div
        className={clsx('mt-4 p-4 block text-white', colorVariants[color].icon)}
      >
        {children[1]}
      </div>

      <div
        className={clsx('mt-4 p-4 block text-white', colorVariants[color].icon)}
      >
        {children[2]}
      </div>

      {/* Botón */}
      <div className="mt-4 flex justify-end gap-3 align-middle">
        {children[3]}
      </div>
    </div>
  );
};

export default CardOperator;

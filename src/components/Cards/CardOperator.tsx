import React, { ReactNode } from 'react';
import clsx from 'clsx';
import { colorVariants } from '../../types/colorVariants';
import { FaArrowLeft } from 'react-icons/fa6';

interface CardDataStatsProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  color?: 'violet' | 'white' | 'red' | 'orange' | 'green';
}

const CardOperator: React.FC<CardDataStatsProps> = ({
  title,
  subtitle,
  children,
  color = 'white',
}) => {
  const childrenArray = React.Children.toArray(children);
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
          {childrenArray[0]}
        </div>
        <div className="pl-7">
          <p className={clsx('text-s font-medium ', colorVariants[color].text)}>
            {title}
          </p>
          <p className={clsx('text-sm font-light ', colorVariants[color].text)}>
            {subtitle}
          </p>
        </div>
        <div className="ml-auto">
          <a href="/operator">
            <div
              className={clsx(
                'flex h-8.5 w-8.5 items-center justify-center rounded-full',
                colorVariants[color].btn,
              )}
            >
              <FaArrowLeft size={20} />
            </div>
          </a>
        </div>
      </div>

      {/* Contenido */}
      <div className={clsx('mt-4 p-4 block', colorVariants[color].bgSub)}>
        {childrenArray[1]}
      </div>

      {childrenArray[2] && (
        <div className={clsx('mt-4 p-4 block', colorVariants[color].bgSub)}>
          {childrenArray[2]}
        </div>
      )}

      {/* Botón */}
      {childrenArray[3] && (
        <div className="mt-4 flex justify-end gap-3 align-middle">
          {childrenArray[3]}
        </div>
      )}
    </div>
  );
};

export default CardOperator;

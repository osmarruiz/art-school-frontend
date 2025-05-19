import clsx from 'clsx';
import { colorVariants } from '../../types/colorVariants';

interface ActionButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  color: 'violet' | 'white' | 'red' | 'orange' | 'green';
  title: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  onClick,
  color,
  title,
}) => (
  <button
    title={title}
    className={clsx(colorVariants[color].btnSc)}
    onClick={onClick}
  >
    {icon}
  </button>
);

export default ActionButton;

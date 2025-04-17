import { colorVariants } from '../../types/colorVariants';
import { clsx } from 'clsx';
import { FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Student } from '../../types/student';

const CardStudent = ({
  student,
  onReset,
  color,
}: {
  student: Student;
  onReset: () => void;
  color: 'violet' | 'white' | 'red' | 'orange' | 'green';
}) => {
  return (
    <motion.div
      animate={{ scale: [0.9, 1] }}
      transition={{ duration: 0.1 }}
      className={clsx('p-4 rounded-lg ', colorVariants[color].bg)}
    >
      <div className="flex justify-between">
        <div className={clsx(colorVariants[color].text)}>
          <h3 className="text-lg font-bold">{student.name}</h3>
          <p>Cédula: {student.id_card || '—'}</p>
          <p>Disciplina(s): {student.coursesString}</p>
        </div>
        <button onClick={onReset} className={clsx(colorVariants[color].btnSc)}>
          <FaArrowLeft size={24} />
        </button>
      </div>
    </motion.div>
  );
};

export default CardStudent;

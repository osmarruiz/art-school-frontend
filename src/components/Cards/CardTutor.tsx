import { colorVariants } from "../../types/colorVariants";
import { clsx } from "clsx";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from 'framer-motion';
import { Tutor } from "../../types/tutor";


const CardTutor = ({
  tutor,
  onReset,
  color,
}: {
  tutor: Tutor;
  onReset: () => void;
  color: 'violet' | 'white' | 'red' | 'orange' | 'green';
}) => {
  return (
    <motion.div
      animate={{ scale: [0.9, 1] }}
      transition={{ duration: 0.1 }}
      className={clsx("p-4 rounded-lg ", colorVariants[color].bg)}
    >
      <div className="flex justify-between">
        <div className={clsx(colorVariants[color].text)}>
          <h3 className="text-lg font-bold">{tutor.name}</h3>
          <p>Cedula: {tutor.id_card}</p>
        </div>
        <button onClick={onReset} className={clsx(colorVariants[color].btnSc)}>
          <FaArrowLeft size={24} />
        </button>
      </div>
    </motion.div>
  );
};

export default CardTutor;
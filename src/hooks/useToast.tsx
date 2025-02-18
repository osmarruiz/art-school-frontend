import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaCheck, FaX } from 'react-icons/fa6';

const useToast = () => {
  const showSuccess = (message: string) => {
    toast.custom(() => (
      <motion.div
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 1, opacity: 1 }}
        className={`flex w-full max-w-xs border-l-6 border-[#34D399] bg-white  px-7 py-8 shadow-md dark:bg-boxdark md:p-9`}
      >
        <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#34D399]">
          <FaCheck size={20} className="text-white" />
        </div>
        <div className="w-full">
          <h5 className="mb-3 text-lg font-semibold text-black dark:text-[#34D399]">
            ¡Operación Exitosa!
          </h5>
          <p className="text-base leading-relaxed text-body">{message}</p>
        </div>
      </motion.div>
    ));
  };

  const showError = (message: string) => {
    toast.custom(() => (
      <motion.div
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 1, opacity: 1 }}
        className={`flex w-full max-w-xs border-l-6 border-[#F87171] bg-white px-7 py-8 shadow-md dark:bg-boxdark md:p-9 
        }`}
      >
        <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#F87171]">
          <FaX size={20} className="text-white" />
        </div>
        <div className="w-full">
          <h5 className="mb-3 font-semibold text-[#B45454]">
            ¡Algo Salió Mal!
          </h5>
          <ul>
            <li className="leading-relaxed text-[#CD5D5D]">{message}</li>
          </ul>
        </div>
      </motion.div>
    ));
  };

  return { showSuccess, showError };
};

export default useToast;

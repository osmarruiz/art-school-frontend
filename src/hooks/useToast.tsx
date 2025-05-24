import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaCheck, FaX } from 'react-icons/fa6';

const useToast = () => {
  const showSuccess = (message: string, hint?: string) => {
  toast.custom(() => (
    <motion.div
      initial={{ x: 200, opacity: 0 }}
      animate={{ x: -10, opacity: 1 }}
      className="flex w-full max-w-xs border-l-6 border-green-500 bg-white px-6 py-6 shadow-md dark:bg-boxdark md:p-7"
    >
      <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-lg bg-green-500">
        <FaCheck size={20} className="text-white" />
      </div>
      <div className="w-full">
        <h5 className="mb-2 font-semibold text-green-700 dark:text-green-300">
          ¡Operación Exitosa!
        </h5>
        <ul>
          <li className="text-green-600 dark:text-green-400 font-medium">{message}</li>
          <li className="mt-1 text-green-500 dark:text-green-500 text-sm">{hint}</li>
        </ul>
      </div>
    </motion.div>
  ));
};


  const showError = (detail: string, hint?: string, errors?: string[] ) => {
  toast.custom(() => (
    <motion.div
      initial={{ x: 200, opacity: 0 }}
      animate={{ x: -10, opacity: 1 }}
      className="flex w-full max-w-xs border-l-6 border-red-600 bg-white px-6 py-6 shadow-md dark:bg-boxdark md:p-7"
    >
      <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-lg bg-red-600">
        <FaX size={20} className="text-white" />
      </div>
      <div className="w-full">
        <h5 className="mb-2 font-semibold text-red-800 dark:text-red-500">
          ¡Algo Salió Mal!
        </h5>
        <ul>
          <li className="text-red-700 dark:text-red-400 text-sm">{detail}</li>
          <li className="mt-1 text-red-600 dark:text-red-300 text-sm">{hint}</li>
          {errors &&
            errors.map((error, index) => (
              <li
                key={index}
                className="mt-1 text-red-500 dark:text-red-200 text-sm"
              >
                {error}
              </li>
            ))}
        </ul>
      </div>
    </motion.div>
  ));
};


  return { showSuccess, showError };
};

export default useToast;

import React, { useEffect, useState } from 'react';
import CardDataStats from '../../components/Cards/CardDataStats';
import { motion } from 'framer-motion';
import { FaAddressBook, FaEye } from "react-icons/fa";
import { FaWallet, FaRepeat } from 'react-icons/fa6';


const Operator: React.FC = () => {
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const horaActual = new Date().getHours();

    if (horaActual >= 5 && horaActual < 12) {
      setMensaje('¡Buenos días! ☀️');
    } else if (horaActual >= 12 && horaActual < 18) {
      setMensaje('¡Buenas tardes! 🌤️');
    } else {
      setMensaje('¡Buenas noches! 🌙');
    }
  }, []);


  return (
    <>
      <div className="grid place-items-center ">
        <div className=" bg-white dark:bg-boxdark dark:border-strokedark p-17 rounded-sm border border-stroke  ">
          <div className=" mb-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {mensaje}
              </h4>
              <span className="text-s font-medium">
                Selecciona cualquiera de las siguientes operaciones
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5 ">
            <motion.a href='/enrollment' initial={{scale: 0.8}} animate={{scale: 1}} whileHover={{scale: 1.1}} >
              <CardDataStats title="Matricular Estudiante" color="violet">
                <FaAddressBook size={18} className='fill-white'/>
              </CardDataStats>
            </motion.a>
            <motion.a href='/payment' initial={{scale: 0.8}} animate={{scale: 1}} whileHover={{scale: 1.1}} >
              <CardDataStats title="Registrar Pago" color="red">
                <FaWallet size={18} className='fill-white' />
              </CardDataStats>
            </motion.a>
            <motion.a href='/renew' initial={{scale: 0.8}} animate={{scale: 1}} whileHover={{scale: 1.1}} >
              <CardDataStats title="Renovar Matricula" color="orange">
                <FaRepeat size={18} className='fill-white'/>
              </CardDataStats>
            </motion.a>
            <motion.a href='#' initial={{scale: 0.8}} animate={{scale: 1}} whileHover={{scale: 1.1}} >
              <CardDataStats title="Vizualizar Estudiantes" color="green" >
                <FaEye size={18} className='fill-white' />
              </CardDataStats>
            </motion.a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Operator;

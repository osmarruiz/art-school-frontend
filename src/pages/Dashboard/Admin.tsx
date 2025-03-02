import React from 'react';
import CardDataStats from '../../components/Cards/CardDataStats';
import ChartThree from '../../components/Charts/ChartThree';
import ChartTwo from '../../components/Charts/ChartTwo';
import { FaUserGroup, FaMoneyBills, FaPencil } from "react-icons/fa6";

const Admin: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
        <CardDataStats title="Matriculas" total="25" rate="0.43%" levelUp>
          <FaUserGroup className='fill-primary dark:fill-white' size={20}/>
        </CardDataStats>

        <CardDataStats
          title="Ingreso Mensual"
          total="$45,2K"
          rate="4.35%"
          levelUp
        >
          <FaMoneyBills className='fill-primary dark:fill-white' size={20}/>
        </CardDataStats>

        <CardDataStats
          title="Ingreso Semanal"
          total="$3,45K"
          rate="0.95%"
          levelDown
        >
          <FaMoneyBills className='fill-primary dark:fill-white' size={20}/>
        </CardDataStats>

        <CardDataStats
          title="Estudiantes Activos"
          total="3.456"
          rate="0.95%"
          color="violet"
          levelDown
        >
          <FaUserGroup className='fill-white' size={20}/>
        </CardDataStats>

        <CardDataStats
          title="Pagos Pendientes"
          total="3.456"
          rate="0.95%"
          color="red"
          levelDown
        >
          <FaPencil className='fill-white' size={20}/>
        </CardDataStats>

        <div className="row-span-2">
          <ChartThree />
        </div>
        <div className="col-span-1 xl:col-span-2 ">
          <ChartTwo />
        </div>
      </div>
    </>
  );
};

export default Admin;

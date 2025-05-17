import React, { useState, useEffect } from 'react';
import CardDataStats from '../../components/Cards/CardDataStats';
import ChartThree from '../../components/Charts/ChartThree';
import ChartTwo from '../../components/Charts/ChartTwo';
import { FaUserGroup, FaMoneyBills, FaPencil } from 'react-icons/fa6';
import { API_URL, API_KEY } from '../../utils/apiConfig';
import { formatCurrency } from '../../utils/formatCurrency';
import { motion } from 'framer-motion';

const Admin: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [month, setMonth] = useState<string | null>(
    sessionStorage.getItem('selectedMonth'),
  );
  const [week, setWeek] = useState<string | null>(
    sessionStorage.getItem('selectedWeek'),
  );

  const fetchData = async () => {
    try {
      const url = () => {
        if (month && week) {
          return `${API_URL}/dashboard.get?month=${month}&week=${week}`;
        } else if (month) {
          return `${API_URL}/dashboard.get?month=${month}`;
        } else if (week) {
          return `${API_URL}/dashboard.get?week=${week}`;
        } else {
          return `${API_URL}/dashboard.get`;
        }
      };
      const response = await fetch(url(), {
        headers: {
          Authorization: API_KEY,
        },
        credentials: 'include',
      });
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } 
  };

  useEffect(() => {
    fetchData();
  }, [month, week]);

  useEffect(() => {
    const checkSessionStorage = () => {
      const newMonth = sessionStorage.getItem('selectedMonth');
      const newWeek = sessionStorage.getItem('selectedWeek');

      if (newMonth !== month) {
        setMonth(newMonth);
      }
      if (newWeek !== week) {
        setWeek(newWeek);
      }
    };

    const intervalId = setInterval(checkSessionStorage, 500);

    return () => clearInterval(intervalId);
  }, [month, week]);

  return (
    <>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 xl:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CardDataStats title="Matriculas" total={data?.month_enrollments || 0}>
              <FaUserGroup className="fill-primary dark:fill-white" size={20} />
            </CardDataStats>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <CardDataStats
              title="Ingresos del Mes"
              total={formatCurrency(data?.month_income  || 0)}
            >
              <FaMoneyBills
                className="fill-primary dark:fill-white"
                size={20}
              />
            </CardDataStats>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CardDataStats
              title="Ingresos en la Semana"
              total={formatCurrency(data?.week_income   || 0)}
            >
              <FaMoneyBills
                className="fill-primary dark:fill-white"
                size={20}
              />
            </CardDataStats>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <CardDataStats
              title="Estudiantes Activos"
              total={data?.active_students || 0}
              color="violet"
            >
              <FaUserGroup className="fill-white" size={20} />
            </CardDataStats>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <CardDataStats
              title="Pagos Pendientes"
              total={data?.pending_transactions || 0}
              color="red"
            >
              <FaPencil className="fill-white" size={20} />
            </CardDataStats>
          </motion.div>

          <motion.div
            className="row-span-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <ChartThree data={data?.courses_distribution} />
          </motion.div>

          <motion.div
            className="col-span-1 xl:col-span-2 "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <ChartTwo data={data?.incomes_in_last_year} />
          </motion.div>
        </div>
    </>
  );
};

export default Admin;

import React, { useState, useEffect } from 'react';
import CardDataStats from '../../components/Cards/CardDataStats';
import ChartThree from '../../components/Charts/ChartThree';
import ChartTwo from '../../components/Charts/ChartTwo';
import { FaUserGroup, FaMoneyBills, FaPencil } from 'react-icons/fa6';
import { API_URL, API_KEY } from '../../utils/apiConfig';
import { formatCurrency } from '../../utils/formatCurrency';

const Admin: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [month, setMonth] = useState<string | null>(
    sessionStorage.getItem('selectedMonth'),
  );
  const [week, setWeek] = useState<string | null>(
    sessionStorage.getItem('selectedWeek'),
  );

  const fetchData = async () => {
    setLoading(true);
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
      console.log(result);
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    finally{
      setLoading(false);
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

    // Intervalo para revisar cada 500 ms si los valores de sessionStorage han cambiado
    const intervalId = setInterval(checkSessionStorage, 500);

    // Cleanup: Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, [month, week]);

  return (
  <>
    {loading ? (
      <></>
    ) : (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
        <CardDataStats title="Matriculas" total={data?.month_enrollments}>
          <FaUserGroup className="fill-primary dark:fill-white" size={20} />
        </CardDataStats>

        <CardDataStats title="Ingreso Mensual" total={formatCurrency(data?.month_income)}>
          <FaMoneyBills className="fill-primary dark:fill-white" size={20} />
        </CardDataStats>

        <CardDataStats title="Ingreso Semanal" total={formatCurrency(data?.week_income)}>
          <FaMoneyBills className="fill-primary dark:fill-white" size={20} />
        </CardDataStats>

        <CardDataStats title="Estudiantes Activos" total={data?.active_students} color="violet">
          <FaUserGroup className="fill-white" size={20} />
        </CardDataStats>

        <CardDataStats title="Pagos Pendientes" total={data?.pending_transactions} color="red">
          <FaPencil className="fill-white" size={20} />
        </CardDataStats>

        <div className="row-span-2">
          <ChartThree data={data?.courses_distribution} />
        </div>
        <div className="col-span-1 xl:col-span-2">
          <ChartTwo data={data?.incomes_in_last_year} />
        </div>
      </div>
    )}
  </>
);
};

export default Admin;

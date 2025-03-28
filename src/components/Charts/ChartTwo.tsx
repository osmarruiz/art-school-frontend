import { ApexOptions } from 'apexcharts';
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { formatCurrency } from '../../utils/formatCurrency';

interface IncomeData {
  date: string;
  income: number;
}

interface ChartTwoProps {
  data: IncomeData[];
}

const ChartTwo: React.FC<ChartTwoProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Extraer mes y año de las fechas
  const categories = sortedData.map(item => {
    const date = new Date(item.date);
    return date.toLocaleString('es-ES', { month: 'short', year: 'numeric' }); // Ej: "ene. 2024"
  });

  const incomeValues = sortedData.map(item => item.income);

  const options: ApexOptions = {
    colors: ['#3C50E0'],
    chart: {
      type: 'bar',
      height: 335,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    xaxis: {
      categories,
      labels: {
        rotate: -45,
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => formatCurrency(value), // Formatear los valores en el eje Y
      },
    },
    tooltip: {
      y: {
        formatter: (value) => formatCurrency(value), // Formatear valores en el tooltip
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '25%',
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      opacity: 1,
    },
  };

  const series = [{ name: 'Ingresos', data: incomeValues }];

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h4 className="text-xl font-semibold text-black dark:text-white">Ingresos del Último Año</h4>
      <ReactApexChart options={options} series={series} type="bar" height={280} />
    </div>
  );
};

export default ChartTwo;

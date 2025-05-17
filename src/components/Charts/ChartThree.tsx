import { ApexOptions } from 'apexcharts';
import React from 'react';
import ReactApexChart from 'react-apexcharts';

interface Course {
  course: string;
  percentage: number;
}

interface ChartThreeProps {
  data: Course[];
}

const ChartThree: React.FC<ChartThreeProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return;
  }

  const labels = data.map((item) => item.course);
  const series = data.map((item) => item.percentage);
  const colors = [
    '#3C50E0',
    '#6577F3',
    '#8FD0EF',
    '#FF5733',
    '#FFC300',
    '#DAF7A6',
  ];

  const options: ApexOptions = {
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'donut',
    },
    colors: colors.slice(0, labels.length),
    labels: labels,
    legend: {
      show: true,
      position: 'bottom',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          background: 'transparent',
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  return (
    
    <div className=" rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark h-full">
      <div className="mb-3">
        <h5 className="text-xl font-semibold text-black dark:text-white">
          Disciplinas
        </h5>
      </div>

      <div className="mb-2 flex justify-center">
        <ReactApexChart options={options} series={series} type="pie" height={500} />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-y-3">
        {data.map((item, index) => (
          <div key={index} className="w-full mx-20">
            <div className="flex w-full items-center">
              <span
                className="mr-2 block h-3 w-full max-w-3 rounded-full"
                style={{ backgroundColor: colors[index] }}
              ></span>
              <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                <span>{item.course}</span>
                <span>{item.percentage}%</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartThree;

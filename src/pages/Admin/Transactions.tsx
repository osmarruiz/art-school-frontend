import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AllCommunityModule,
  ModuleRegistry,
  colorSchemeLightCold,
  colorSchemeDarkBlue,
  themeQuartz,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import useColorMode from '../../hooks/useColorMode';
import { FaMinus, FaMoneyBillWave, FaPencil, FaPlus, FaStar } from 'react-icons/fa6';
import { Student } from '../../types/student';
import clsx from 'clsx';
import { FaSearch } from 'react-icons/fa';
import CardDataStats from '../../components/Cards/CardDataStats';
import { colorVariants } from '../../types/colorVariants';
import SelectGroupOne from '../../components/Forms/SelectGroup/SelectGroupOne';

ModuleRegistry.registerModules([AllCommunityModule]);
const themeLightCold = themeQuartz.withPart(colorSchemeLightCold);
const themeDarkBlue = themeQuartz.withPart(colorSchemeDarkBlue);

const Disciplines: React.FC = () => {
  const [colorMode] = useColorMode();
  const gridRef = useRef<AgGridReact<any> | null>(null);
  const [theme, setTheme] = useState(themeLightCold);


  //temporal----------------------------------
  const [rowData] = useState<Student[]>([
    {
      id: 1,
      id_card: '12345678',
      name: 'Juan Perez',
      course: 'Matemáticas',
      is_active: true,
    },
    {
      id: 2,
      id_card: '87654321',
      name: 'Ana López',
      course: 'Historia',
      is_active: false,
    },
    {
      id: 3,
      id_card: '11223344',
      name: 'Carlos Díaz',
      course: 'Ciencias',
      is_active: true,
    },
    {
      id: 3,
      id_card: '11223344',
      name: 'Carlos Díaz',
      course: 'Ciencias',
      is_active: true,
    },
    {
      id: 3,
      id_card: '11223344',
      name: 'Carlos Díaz',
      course: 'Ciencias',
      is_active: true,
    },
    {
      id: 3,
      id_card: '11223344',
      name: 'Carlos Díaz',
      course: 'Ciencias',
      is_active: true,
    },
    {
      id: 3,
      id_card: '11223344',
      name: 'Carlos Díaz',
      course: 'Ciencias',
      is_active: true,
    },
    {
      id: 3,
      id_card: '11223344',
      name: 'Carlos Díaz',
      course: 'Ciencias',
      is_active: true,
    },
  ]);
  //temporal----------------------------------

  //cambia el tema del aggrid segun el estado de colorMode
  useEffect(() => {
    setTheme(colorMode === 'dark' ? themeDarkBlue : themeLightCold);
  }, [colorMode]);

  

  // Definición de columnas con tipado correcto

  const columnDefs = useMemo(
    () => [

      { field: 'id', headerName: 'ID' },
      { field: 'name', headerName: 'Estudiante' },
      { field: 'id_card', headerName: 'Tarifa' },
      { field: 'id_card', headerName: 'Fecha' },
      { field: 'id_card', headerName: 'Total' },
    ],
    [],
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,

      flex: 1,
      minWidth: 100,
    }),
    [],
  );

  return (
    <>
      <div className="block sm:flex justify-between items-center gap-4 text">
        <div className="flex justify-center sm:justify-start  sm:w-1/5 mb-4 sm:mb-6">
          <h1 className="text-title-md xl:text-title-md2 font-bold text-black dark:text-white">
           Transacciones
          </h1>
        </div>

        <div className="flex justify-center sm:w-3/5  mb-4 sm:mb-6">
          <div
            className={clsx('relative w-full e', colorVariants['white'].text)}
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch size={16} />
            </span>
            <input
              type="text"
              placeholder="Buscar transaccion"
              className={clsx(
                'w-full h-12 bg-white pl-9 pr-4 text-black focus:outline-none rounded-lg shadow-default',
                colorVariants['white'].inp,
              )}
            />
          </div>

          
        </div>
        <div className='flex justify-center sm:justify-end gap-4 sm:w-1/5  mb-6'>
            <SelectGroupOne placeholder='Seleccionar un mes'/>
          </div>
      </div>
      <div className="h-125 w-full">
        <AgGridReact
          ref={gridRef}
          theme={theme}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowHeight={75}
        />
      </div>
      <div className="sm:flex justify-end gap-4 md:gap-6 my-6">
        <div className="sm:w-1/2 xl:w-1/4 mb-4">
          <CardDataStats title="Total de transacciones" total="50">
            <FaMoneyBillWave className="fill-primary dark:fill-white" size={20} />
          </CardDataStats>
        </div>
      </div>
    </>
  );
};

export default Disciplines;

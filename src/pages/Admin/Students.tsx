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
import { FaEye, FaMinus, FaPencil, FaPlus, FaUserGroup } from 'react-icons/fa6';
import { Student } from '../../types/student';
import clsx from 'clsx';
import { FaSearch } from 'react-icons/fa';
import CardDataStats from '../../components/Cards/CardDataStats';
import { colorVariants } from '../../types/colorVariants';
import SelectGroupOne from '../../components/Forms/SelectGroup/SelectGroupOne';

ModuleRegistry.registerModules([AllCommunityModule]);
const themeLightCold = themeQuartz.withPart(colorSchemeLightCold);
const themeDarkBlue = themeQuartz.withPart(colorSchemeDarkBlue);

const Students: React.FC = () => {
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

  // Renderer para la columna de estado
  const estadoRenderer = (params: { value: boolean }) => {
    return (
      <span
        className={`text-sm py-1 px-2  rounded ${
          params.value
            ? 'bg-green-200 dark:bg-green-900'
            : 'bg-red-200 dark:bg-red-900'
        }`}
      >
        {params.value ? 'Activo' : 'Inactivo'}
      </span>
    );
  };

  // Renderer para la columna de acciones
  const opcionesRenderer = (params: { data: { is_active: boolean 
} }) => {
    return (
      <div className="flex gap-4 mt-1 justify-center ">
        <button className={clsx(colorVariants['white'].btnSc)}>
          <FaEye size={20} />
        </button>

        <button className={clsx(colorVariants['white'].btnSc)}>
          <FaPencil size={20} />
        </button>

        <button className={clsx(colorVariants['white'].btnSc)}>
        {params.data.is_active ? <FaMinus size={20} /> : <FaPlus size={20} />}
      </button>
      </div>
    );
  };

  // Definición de columnas con tipado correcto

  const columnDefs = useMemo(
    () => [
      { field: 'id', headerName: 'Numero' },
      { field: 'name', headerName: 'Nombre' },
      { field: 'id_card', headerName: 'Cedula' },
      { field: 'id_card', headerName: 'Curso' },
      { field: 'id_card', headerName: 'Turno' },
      { field: 'id_card', headerName: 'Edad' },
      {
        field: 'is_active',
        headerName: 'Estado',
        cellRenderer: estadoRenderer,
      },
      {
        field: 'opciones',
        headerName: 'Opciones',
        cellRenderer: opcionesRenderer,
      },
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
            Estudiantes
          </h1>
        </div>

        <div className="flex justify-center sm:w-2/5  mb-4 sm:mb-6">
          <div
            className={clsx('relative w-full e', colorVariants['white'].text)}
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch size={16} />
            </span>
            <input
              type="text"
              placeholder="Busca un estudiante para continuar..."
              className={clsx(
                'w-full h-12 bg-white pl-9 pr-4 text-black focus:outline-none rounded-lg shadow-default',
                colorVariants['white'].inp,
              )}
            />
          </div>

          
        </div>
        <div className='flex justify-center sm:justify-end gap-4 sm:w-2/5  mb-6'>
            <div className="w-1/3">

            <SelectGroupOne placeholder='Curso'/>
            </div>
            <div className="w-1/3">

            <SelectGroupOne placeholder='Turno'/>
            </div>
            <div className="w-1/3">

            <SelectGroupOne placeholder='Edad'/>
            </div>
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
          <CardDataStats title="Total de activos" total="50">
            <FaUserGroup className="fill-primary dark:fill-white" size={20} />
          </CardDataStats>
        </div>
        <div className="sm:w-1/2 xl:w-1/4">
          <CardDataStats title="Total de inactivos" total="50">
            <FaUserGroup className="fill-primary dark:fill-white" size={20} />
          </CardDataStats>
        </div>
      </div>
    </>
  );
};

export default Students;

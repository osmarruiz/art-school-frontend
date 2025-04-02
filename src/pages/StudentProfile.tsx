import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AllCommunityModule,
  ModuleRegistry,
  colorSchemeLightCold,
  colorSchemeDarkBlue,
  themeQuartz,
  ColDef,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import useColorMode from '../hooks/useColorMode';
import { FaEye, FaMinus, FaPencil, FaPlus, FaUserGroup } from 'react-icons/fa6';
import { Student } from '../types/student';
import clsx from 'clsx';
import { FaSearch } from 'react-icons/fa';
import CardDataStats from '../components/Cards/CardDataStats';
import { colorVariants } from '../types/colorVariants';
import SelectGroupOne from '../components/Forms/SelectGroup/SelectGroupOne';
import { useParams } from 'react-router-dom';
// import { API_URL, API_KEY } from '../utils/';

ModuleRegistry.registerModules([AllCommunityModule]);
const themeLightCold = themeQuartz.withPart(colorSchemeLightCold);
const themeDarkBlue = themeQuartz.withPart(colorSchemeDarkBlue);

interface DataItem {
  label: string;
  value: string | number | React.ReactNode;
}

interface Transaction {
  id: string;
  alumno: string;
  tarifa: string;
  fecha: string;
  total: string;
}

interface StudentProfileData {
  personalData: { label: string; value: string }[];
  tutorData: { label: string; value: string }[];
  academicData: { label: string; value: string }[];
  enrollmentData: { label: string; value: string }[];
  pendingTransactions: Transaction[];
  finalizedTransactions: Transaction[];
  name: string;
  isActive: boolean;
  registrationDate: string;
}


const StudentProfile: React.FC = () => {
  const { id } = useParams();
  const [colorMode] = useColorMode();
  const [theme, setTheme] = useState(themeLightCold);
  const [studentData, setStudentData] = useState<StudentProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //temporal----------------------------------

  const personalData: DataItem[] = [
    { label: 'Cédula', value: '282-120003-32400' },
    { label: 'Nacimiento', value: 'Enero 02, 2000 (11 año' },
    { label: 'Correo', value: 'Jarvis hermann4@gmail.com' },
    { label: 'Teléfono', value: '+ 5058609-9193' },
    { label: 'Ciudad', value: 'Rumallsdottirhaven' },
    { label: 'Dirección', value: '55887 Considine Square' },
  ];

  const tutorData: DataItem[] = [
    { label: 'Parentesco', value: 'Padre / madre' },
    { label: 'Nombre', value: 'Jason Turcotte' },
    { label: 'Cédula', value: '282-010203-20010' },
    { label: 'Correo', value: 'domenica99@yahoo.com' },
    { label: 'Teléfono', value: '-505 8060-5100' },
    { label: 'Ciudad', value: 'East Eliza' },
    { label: 'Dirección', value: '488 Wash Pines' },
  ];


  const enrollmentData: DataItem[] = [
    { label: 'Curso', value: 'Violín' },
    { label: 'Turno', value: 'Sabatino' },
    { label: '¿Pago finalizado?', value: 'No' },
    { label: 'Registro', value: 'viernes, 24 de enero 2025, 14:54:30' }
  ];

  const academicData: DataItem[] = [
    { label: 'Colegio de procedencia', value: 'Rubén Darío' },
    { label: 'Año escolar', value: '11' }
  ];

  //temporal----------------------------------

  //cambia el tema del aggrid segun el estado de colorMode
  useEffect(() => {
    setTheme(colorMode === 'dark' ? themeDarkBlue : themeLightCold);
  }, [colorMode]);

  // Renderer para la columna de estado
  const estadoRenderer = (params: { value: boolean }) => {
    return (
      <span
        className={`text-sm py-1 px-2  rounded ${params.value
            ? 'bg-green-200 dark:bg-green-900'
            : 'bg-red-200 dark:bg-red-900'
          }`}
      >
        {params.value ? 'Activo' : 'Inactivo'}
      </span>
    );
  };

  // Renderer para la columna de acciones
  const opcionesRenderer = (params: {
    data: {
      is_active: boolean
    }
  }) => {
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

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,

      flex: 1,
      minWidth: 100,
    }),
    [],
  );

  const pendingGridRef = useRef<AgGridReact<Transaction>>(null);
  const finalizedGridRef = useRef<AgGridReact<Transaction>>(null);
  const [pendingRowData, setPendingRowData] = useState<Transaction[]>([]);
  const [finalizedRowData, setFinalizedRowData] = useState<Transaction[]>([]);


  useEffect(() => {
    setPendingRowData([
      { id: '0001', alumno: 'Juan Perez', tarifa: 'Reingreso', fecha: '28/11/2024', total: '$ 05' },
      { id: '0002', alumno: 'Sofa Gonzales', tarifa: 'Min', fecha: '28/11/2024', total: '$ 40' },
      // ... your pending transactions
    ]);

    setFinalizedRowData([
      { id: '0001', alumno: 'Juan Perez', tarifa: 'Reingreso', fecha: '38/11/2024', total: '$ 65' },
      { id: '0002', alumno: 'Sofia Gonzalez', tarifa: '', fecha: '28/11/2004', total: '$ 40' },
      // ... your finalized transactions
    ]);
  }, []);

  const pendingColumnDefs: ColDef<Transaction>[] = useMemo(
    () => [
      { field: 'id', headerName: '#' },
      { field: 'alumno', headerName: 'Alumno', flex: 1 },
      { field: 'tarifa', headerName: 'Tarifa', flex: 1 },
      { field: 'fecha', headerName: 'Fecha', flex: 1 },
      { field: 'total', headerName: 'Total', flex: 1 },
    ],
    []
  );

  const finalizedColumnDefs: ColDef<Transaction>[] = useMemo(
    () => [
      { field: 'id', headerName: '#' },
      { field: 'alumno', headerName: 'Alumno', flex: 1 },
      { field: 'tarifa', headerName: 'Tarifa', flex: 1 },
      { field: 'fecha', headerName: 'Fecha', flex: 1 },
      { field: 'total', headerName: 'Total', flex: 1 },
    ],
    []
  );


  return (

    <div className="font-sans">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-1">
          <h2 className="text-4xl sm:text-4xl font-bold mb-2 sm:mb-0">
            Josh Alexander Upton
          </h2>

          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Desactivar
          </button>

        </div>
        <p className="text-md text-gray-600">
          <span className="font-semibold">Registro:</span> viernes, 24 de enero de 2025, 14:54:30
          <span> | </span>
          <span className="text-green-500">(Activo)</span>
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white dark:bg-gray-800 shadow rounded-md p-6">
          <h3 className="text-2xl font-semibold mb-4">Datos Personales</h3>
          {personalData.map((item) => (
            <div key={item.label} className="grid grid-cols-2 gap-y-4 text-lg">
              <dt className="font-medium text-gray-700 dark:text-gray-300 mb-1">{item.label}</dt>
              <dd className="text-gray-600 dark:text-gray-400">{item.value}</dd>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-md p-6">
          <h3 className="text-2xl font-semibold mb-4">Datos del Tutor</h3>
          {tutorData.map((item) => (
            <div key={item.label} className="grid grid-cols-2 gap-y-4 text-lg">
              <dt className="font-medium text-gray-700 dark:text-gray-300 mb-1">{item.label}</dt>
              <dd className="text-gray-600 dark:text-gray-400">{item.value}</dd>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white dark:bg-gray-800 shadow rounded-md p-6">
          <h3 className="text-2xl font-semibold mb-4">Matrícula</h3>
          {enrollmentData.map((item) => (
            <div key={item.label} className="grid grid-cols-2 gap-y-4 text-lg">
              <dt className="font-medium text-gray-700 dark:text-gray-300 mb-1">{item.label}</dt>
              <dd className="text-gray-600 dark:text-gray-400">{item.value}</dd>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-md p-6">
          <h3 className="text-2xl font-semibold mb-4">Datos Académicos</h3>
          {academicData.map((item) => (
            <div key={item.label} className="grid grid-cols-2 gap-y-4 text-lg">
              <dt className="font-medium text-gray-700 dark:text-gray-300 mb-1">{item.label}</dt>
              <dd className="text-gray-600 dark:text-gray-400">{item.value}</dd>
            </div>
          ))}
        </div>
      </div>


      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-2">Transacciones Pendientes (5)</h3>
        <div className="w-full h-75">
          <AgGridReact
            ref={pendingGridRef}
            rowData={pendingRowData}
            theme={theme}
            columnDefs={pendingColumnDefs}
            defaultColDef={defaultColDef}
            rowSelection="single"
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-2">Transacciones Finalizadas (20)</h3>
        <div className="w-full h-75">
          <AgGridReact
            ref={finalizedGridRef}
            rowData={finalizedRowData}
            theme={theme}
            columnDefs={finalizedColumnDefs}
            defaultColDef={defaultColDef}
            rowSelection="single"
          />
        </div>
      </div>
    </div>

  )
};

export default StudentProfile;

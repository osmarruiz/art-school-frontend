import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AllCommunityModule,
  ModuleRegistry
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { FaUserGroup, FaX } from 'react-icons/fa6';
import { Student } from '../../types/student';
import clsx from 'clsx';
import { FaSearch } from 'react-icons/fa';
import CardDataStats from '../../components/Cards/CardDataStats';
import { colorVariants } from '../../utils/colorVariants';
import SelectGroup from '../../components/Forms/SelectGroup/SelectGroup';
import { API_KEY, API_URL } from '../../utils/apiConfig';
import { useNavigate } from 'react-router-dom';
import { formatDateFlexible } from '../../utils/formatDateflexible';
import { Course } from '../../types/course';
import { Shift } from '../../types/shift';
import { useAgGridConfig } from '../../hooks/useAgGridConfig';
import { normalizeSearchText, normalizeText } from '../../utils/normalizeText';

ModuleRegistry.registerModules([AllCommunityModule]);

interface StudentResponse {
  total: number;
  total_active: number;
  total_inactive: number;
  students: Student[];
}

const Students: React.FC = () => {
  const gridRef = useRef<AgGridReact<any> | null>(null);
  const [rowData, setRowData] = useState<StudentResponse>();
  const [searchText, setSearchText] = useState('');
  const [courseData, setCourseData] = useState<Course[]>([]);
  const [shifts, _] = useState<Shift[]>([
    {
      id: 7,
      name: 'Diario',
      is_closed: false,
      capacity_of_students: 0,
      num_of_students: 0,
    },
    {
      id: 8,
      name: 'Sabatino',
      is_closed: false,
      capacity_of_students: 0,
      num_of_students: 0,
    },
  ]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [selectedShift, setSelectedShift] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { theme, defaultColDef, localeText } = useAgGridConfig();

  const fetchData = async (course?: number, shift?: number) => {
    try {
      let url = `${API_URL}/students.list?rpp=9999999`;
      if (course) url += `&course=${course}`;
      if (shift) url += `&shift=${shift}`;

      const response = await fetch(url, {
        headers: {
          Authorization: API_KEY,
        },
        credentials: 'include',
      });

      const data = await response.json();
      data.students = data.students.map((student: Student) => ({
        ...student,
        coursesString:
          student.courses && student.courses.length > 0
            ? student.courses.map((course) => course.name).join(', ')
            : 'Sin cursos',
      }));
      setRowData(data);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedCourse ?? undefined, selectedShift ?? undefined);
  }, [selectedCourse, selectedShift]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(`${API_URL}/courses.list`, {
          headers: {
            Authorization: API_KEY,
          },
          credentials: 'include',
        });
        const courses: Course[] = await response.json();
        setCourseData(courses);
      } catch (error) {
        console.error('Error al obtener los datos', error);
      }
    };
    fetchData();
  }, []);

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

 const filteredData = useMemo(() => {
  if (!searchText) return rowData?.students ?? [];
  if (!rowData?.students) return [];

  const normalizedSearch = normalizeSearchText(searchText);

  return rowData.students.filter(student => {
    const studentName = normalizeText(student.name);
    const studentId = normalizeText(student.id_card);
    
    return studentName.includes(normalizedSearch) || 
           studentId.includes(normalizedSearch);
  });
}, [rowData, searchText]);

  const columnDefs = useMemo(
    () => [
      { field: 'id', headerName: 'ID' },
      { field: 'name', headerName: 'Nombre', flex: 2 },
      {
        field: 'id_card',
        headerName: 'Cédula',
        valueFormatter: (params: { value: any }) =>
          ((v) => (!v ? '—' : v))(params.value),
      },
      {
        field: 'email',
        headerName: 'Correo',
        valueFormatter: (params) => ((v) => (!v ? '—' : v))(params.value),
      },
      {
        field: 'phone_number',
        headerName: 'Teléfono',
        valueFormatter: (params) => ((v) => (!v ? '—' : v))(params.value),
      },
      {
        field: 'date_of_birth',
        headerName: 'Nacimiento',
        valueFormatter: (params) =>
          formatDateFlexible(params.value, {
            type: 'date',
            withTimezoneOffset: true,
          }),
      },
      { field: 'coursesString', headerName: 'Curso(s)' },
      {
        field: 'is_active',
        headerName: 'Estado',
        cellRenderer: estadoRenderer,
      },
    ],
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
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Buscar estudiante (nombre, cédula)"
              className={clsx(
                'w-full h-12 bg-white pl-9 pr-4 text-black focus:outline-none rounded-lg shadow-default',
                colorVariants['white'].inp,
              )}
            />
          </div>
        </div>
        <div className="flex justify-center sm:justify-end gap-4 sm:w-2/5  mb-6">
          <div className="w-1/3 justify-center sm:justify-end flex">
            <button
              onClick={() => {
                navigate('/students');
              }}
            >
              <FaX size={14} />
            </button>
          </div>
          <div className="w-1/3">
            <SelectGroup
              placeholder="Curso"
              course={courseData}
              onChange={(selected: number) => setSelectedCourse(selected)}
            />
          </div>
          <div className="w-1/3">
            <SelectGroup
              placeholder="Turno"
              shift={shifts}
              onChange={(selected: number) => setSelectedShift(selected)}
            />
          </div>
        </div>
      </div>
      <div className="h-125 w-full">
        <AgGridReact
          ref={gridRef}
          theme={theme}
          loading={loading}
          localeText={localeText}
          rowData={filteredData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onRowClicked={(event) => {
            if (event.data) {
              navigate(`/student/${event.data.id}`);
            }
          }}
          rowStyle={{ cursor: 'pointer' }}
        />
      </div>
      <div className="sm:flex justify-end gap-4 md:gap-6 my-6">
        <div className="sm:w-1/2 xl:w-1/4 mb-4">
          <CardDataStats
            title="Total de activos"
            total={`${rowData?.total_active.toString() || '0'}`}
          >
            <FaUserGroup className="fill-primary dark:fill-white" size={20} />
          </CardDataStats>
        </div>
        <div className="sm:w-1/2 xl:w-1/4">
          <CardDataStats
            title="Total de inactivos"
            total={`${rowData?.total_inactive.toString() || '0'}`}
          >
            <FaUserGroup className="fill-danger dark:fill-white" size={20} />
          </CardDataStats>
        </div>
      </div>
    </>
  );
};

export default Students;

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Student } from '../../types/student';
import {
  AllCommunityModule,
  ModuleRegistry,
  colorSchemeLightCold,
  colorSchemeDarkBlue,
  themeQuartz,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import useColorMode from '../../hooks/useColorMode';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import { colorVariants } from '../../types/colorVariants';
import clsx from 'clsx';
import { API_URL, API_KEY } from '../../utils/apiConfig';
import { formatDateFlexible } from '../../utils/formatDateflexible';
ModuleRegistry.registerModules([AllCommunityModule]);
const themeLightCold = themeQuartz.withPart(colorSchemeLightCold);
const themeDarkBlue = themeQuartz.withPart(colorSchemeDarkBlue);

interface TabletStudentProps {
  onSelect: (student: Student) => void;
  color: 'violet' | 'white' | 'red' | 'orange' | 'green';
}

const TabletStudent: React.FC<TabletStudentProps> = ({ onSelect, color }) => {
  const [studentData, setStudentData] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<AgGridReact<any> | null>(null);
  const [colorMode] = useColorMode();
  const [theme, setTheme] = useState(themeLightCold);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/students.list?rpp=9999999&status=active`,
          {
            headers: {
              Authorization: API_KEY,
            },
            credentials: 'include',
          },
        );
        const data = await response.json();
        const processedStudents = data.students.map((student: Student) => ({
          ...student,
          coursesString:
            student.courses && student.courses.length > 0
              ? student.courses.map((course) => course.name).join(', ')
              : 'Sin cursos',
        }));

        setStudentData(processedStudents);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredStudents = studentData.filter((student) => {
    const name =
      student?.name
        ?.toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ') || '';
    const idCard =
      student?.id_card
        ?.toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ') || '';
    const coursesString =
      student?.coursesString
        ?.toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ') || '';

    return (
      name.includes(
        searchTerm
          .toLowerCase()
          .trim()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, ' '),
      ) ||
      idCard.includes(
        searchTerm
          .toLowerCase()
          .trim()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, ' '),
      ) ||
      coursesString.includes(
        searchTerm
          .toLowerCase()
          .trim()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, ' '),
      )
    );
  });

  useEffect(() => {
    setTheme(colorMode === 'dark' ? themeDarkBlue : themeLightCold);
  }, [colorMode]);

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

  const localeText = {
  loadingOoo: 'Cargando...',
  noRowsToShow: 'No hay filas para mostrar',
  page: 'Página',
  of: 'de',
  next: 'Siguiente',
  previous: 'Anterior',
  filterOoo: 'Filtrando...',
  applyFilter: 'Aplicar filtro',
  resetFilter: 'Reiniciar filtro',
  searchOoo: 'Buscando...',
};


  return (
    <motion.div
      animate={{ scale: [0.9, 1] }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="relative mb-4">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <FaSearch size={16} className={clsx(colorVariants[color].text)} />
        </span>
        <input
          type="text"
          placeholder="Busca un estudiante para continuar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={clsx(
            'w-full h-12 bg-white pl-9 pr-4 text-black focus:outline-none rounded-lg shadow-default',
            colorVariants[color].inp,
          )}
        />
      </div>
      <div className=" " style={{ height: 550, width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          theme={theme}
          columnDefs={columnDefs}
          localeText={localeText}
          defaultColDef={defaultColDef}
          rowData={filteredStudents}
          loading={loading}
          onRowClicked={(event) => {
            if (event.data) {
              onSelect(event.data);
            }
          }}
          rowStyle={{ cursor: 'pointer' }}
        />
      </div>
    </motion.div>
  );
};

export default TabletStudent;

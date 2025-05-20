import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Student } from '../../types/student';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import { colorVariants } from '../../utils/colorVariants';
import clsx from 'clsx';
import { API_URL, API_KEY } from '../../utils/apiConfig';
import { formatDateFlexible } from '../../utils/formatDateflexible';
import { useAgGridConfig } from '../../hooks/useAgGridConfig';
import { normalizeText } from '../../utils/normalizeText';

ModuleRegistry.registerModules([AllCommunityModule]);

interface TabletStudentProps {
  onSelect: (student: Student) => void;
  color: 'violet' | 'white' | 'red' | 'orange' | 'green';
}

const TabletStudentSearch: React.FC<TabletStudentProps> = ({
  onSelect,
  color,
}) => {
  const [studentData, setStudentData] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<AgGridReact<any> | null>(null);
  const { theme, defaultColDef, localeText } = useAgGridConfig();

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
    const searchTermNormalized = normalizeText(searchTerm);

    return [student.name, student.id_card, student.coursesString].some(
      (field) => normalizeText(field).includes(searchTermNormalized),
    );
  });

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
          placeholder="Busca un estudiante para continuar (nombre, cédula o curso)"
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

export default TabletStudentSearch;

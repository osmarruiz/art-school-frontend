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

ModuleRegistry.registerModules([AllCommunityModule]);
const themeLightCold = themeQuartz.withPart(colorSchemeLightCold);
const themeDarkBlue = themeQuartz.withPart(colorSchemeDarkBlue);

interface StudentSearchProps {
  onSelect: (student: Student) => void;
  color: 'violet' | 'white' | 'red' | 'orange' | 'green';
}

const TabletStudent: React.FC<StudentSearchProps> = ({ onSelect, color}) => {
  const [studentData, setStudentData] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<AgGridReact<any> | null>(null);
  const [colorMode] = useColorMode();
  const [theme, setTheme] = useState(themeLightCold);

  //permite filtrar los estudiantes de la barra de busqueda
  const filteredStudents = studentData.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id_card.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  //cambia el tema del aggrid segun el estado de colorMode
  useEffect(() => {
    setTheme(colorMode === 'dark' ? themeDarkBlue : themeLightCold);
  }, [colorMode]);

  //obtiene los estudiantes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/students.list?rpp=999&status=active');
        const data = await response.json();
        setStudentData(data.students);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  //definiciones del aggrid
  const columnDefs = useMemo(
    () => [
      { field: 'name', headerName: 'Nombre' },
      { field: 'id_card', headerName: 'Cedula' },
      { field: 'course', headerName: 'Curso' },
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
          placeholder="Buscar estudiante"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={clsx("w-full h-12 bg-white pl-9 pr-4 text-black focus:outline-none rounded-lg shadow-default",colorVariants[color].inp)}
        />
      </div>
      <div className=" " style={{ height: 250, width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          theme={theme}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowData={filteredStudents}
          loading={loading}
          onRowClicked={(event) => onSelect(event.data)}
          rowStyle={{ cursor: 'pointer' }}
        />
      </div>
    </motion.div>
  );
};

export default TabletStudent;

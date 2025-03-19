import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Tutor } from '../../types/tutor';
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
import { API_URL, API_KEY } from '../../utils/apiConfig';

ModuleRegistry.registerModules([AllCommunityModule]);
const themeLightCold = themeQuartz.withPart(colorSchemeLightCold);
const themeDarkBlue = themeQuartz.withPart(colorSchemeDarkBlue);

interface TabletTutorProps {
  onSelect: (tutor: Tutor) => void;
}

const TabletTutor: React.FC<TabletTutorProps> = ({ onSelect }) => {
  const [tutorData, setTutorData] = useState<Tutor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<AgGridReact<any> | null>(null);
  const [colorMode] = useColorMode();
  const [theme, setTheme] = useState(themeLightCold);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/students.tutors.list?rpp=999`,
                  {
                    headers: {
                      Authorization: API_KEY,
                    },
                    credentials: 'include',
                  },);
        const data = await response.json();
        setTutorData(data);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  
  const filteredStudents = tutorData.filter(
    (tutor) =>
      tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.id_card.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //cambia el tema del aggrid segun el estado de colorMode
  useEffect(() => {
    setTheme(colorMode === 'dark' ? themeDarkBlue : themeLightCold);
  }, [colorMode]);

  

  //definiciones del aggrid
  const columnDefs = useMemo(
    () => [
      { field: 'name', headerName: 'Nombre' },
      { field: 'id_card', headerName: 'Cedula' },
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
          <FaSearch size={16} className="text-boxdark" />
        </span>
        <input
          type="text"
          placeholder="Buscar tutor"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-12 bg-white border border-stroke pl-9 pr-4 text-black focus:outline-none rounded-lg shadow-default"
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

export default TabletTutor;

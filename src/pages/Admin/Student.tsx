import StudentSearch from "../../components/Tables/TableStudent";
import { useMemo, useRef, useState } from "react";
import {
  AllCommunityModule,
  ModuleRegistry,
  colorSchemeLightCold,
  colorSchemeDarkBlue,
  themeQuartz,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import useColorMode from '../../hooks/useColorMode';
import { FaEye } from "react-icons/fa6";
import { Student } from "../../types/student";
import clsx from "clsx";
import { FaSearch } from "react-icons/fa";

ModuleRegistry.registerModules([AllCommunityModule]);
const themeLightCold = themeQuartz.withPart(colorSchemeLightCold);
const themeDarkBlue = themeQuartz.withPart(colorSchemeDarkBlue);

const Students: React.FC = () => {

  const [colorMode] = useColorMode();
  const gridRef = useRef<AgGridReact<any> | null>(null);
  const [theme, setTheme] = useState(themeLightCold);

  const [rowData] = useState<Student[]>([
    { id: 1, id_card: "12345678", name: "Juan Perez", course: "Matemáticas", is_active: true },
    { id: 2, id_card: "87654321", name: "Ana López", course: "Historia", is_active: false },
    { id: 3, id_card: "11223344", name: "Carlos Díaz", course: "Ciencias", is_active: true },
  ]);

  // Renderer para la columna de estado
  const estadoRenderer = (params: { value: boolean }) => {
    return (
      <span className={`px-2 py-1 rounded ${params.value ? "bg-green-200" : "bg-red-200"}`}>
        {params.value ? "Activo" : "Inactivo"}
      </span>
    );
  };

  // Renderer para la columna de acciones
  const opcionesRenderer = () => {
    return (
      <div className="flex align-middle justify-center h-full">
        <button><FaEye size={20}/></button>
      </div>
    );
  };

  // Definición de columnas con tipado correcto
  

  const columnDefs = useMemo(
      () => [
        { field: 'id', headerName: 'Numero' },
        { field: 'name', headerName: 'Nombre' },
        { field: 'id_card', headerName: 'Cedula' },
        {field: 'is_active', headerName: 'Estado', cellRenderer: estadoRenderer},
        { field: 'opciones', headerName: 'Opciones', cellRenderer: opcionesRenderer },
        
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
    <div className="block sm:flex justify-between align-middle mb-2">
      <div className="flex justify-center">
        <h1 className="text-title-md font-bold text-black dark:text-white">Estudiantes</h1>
      </div>
      <div className="flex justify-center">
        <div className="relative w-80">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaSearch size={16} />
                </span>
                <input
                  type="text"
                  placeholder="Buscar estudiante"
                  className={clsx("w-full h-12 bg-white pl-9 pr-4 text-black focus:outline-none rounded-lg shadow-default")}
                />
              </div>
      </div>
    </div>
    <div className="" style={{ height: 400, width: "100%" }}>

    <AgGridReact 
          ref={gridRef}
          theme={theme}
          rowData={rowData} 
          columnDefs={columnDefs} 
          defaultColDef={defaultColDef}
          rowHeight={80}
          paginationPageSizeSelector={[5, 10, 20]}
          pagination={true}
          paginationPageSize= {10}
          />
    </div>
    </>
  )
};

export default Students;
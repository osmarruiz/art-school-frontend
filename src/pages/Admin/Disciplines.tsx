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
import { FaPencil, FaStar } from 'react-icons/fa6';
import { API_URL, API_KEY } from '../../utils/apiConfig';
import clsx from 'clsx';
import { FaSearch } from 'react-icons/fa';
import CardDataStats from '../../components/Cards/CardDataStats';
import { colorVariants } from '../../types/colorVariants';
import { Course } from '../../types/course';
import { Shift } from '../../types/shift';
import Swal from 'sweetalert2';
import { Type } from '../../types/type';
import { formatCurrency } from '../../utils/formatCurrency';

ModuleRegistry.registerModules([AllCommunityModule]);

const themeLightCold = themeQuartz.withPart(colorSchemeLightCold);
const themeDarkBlue = themeQuartz.withPart(colorSchemeDarkBlue);

const Disciplines: React.FC = () => {
  const [colorMode] = useColorMode();
  const gridRef = useRef<AgGridReact<any> | null>(null);
  const [theme, setTheme] = useState(themeLightCold);
  const [rowData, setRowData] = useState<Course[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${API_URL}/courses.list?rpp=999&status=active`,
        {
          headers: {
            Authorization: API_KEY,
          },
          credentials: 'include',
        },
      );

      const data = await response.json();
      setRowData(data);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setTheme(colorMode === 'dark' ? themeDarkBlue : themeLightCold);
  }, [colorMode]);

  const getShiftsAsString = (shifts: Shift[] | null): string => {
    if (!shifts || shifts.length === 0) return '';
    return shifts.map((s) => s.name).join(', ');
  };

  const filteredData = useMemo(() => {
    return rowData.filter((item) => {
      const shifts = getShiftsAsString(item.shifts);
      const valuesToSearch = [
        item.id?.toString() ?? '',
        item.name ?? '',
        shifts ?? '',
        item.type.name ?? '',
      ];

      return valuesToSearch.some((value) =>
        value.toLowerCase().includes(searchText.toLowerCase()),
      );
    });
  }, [rowData, searchText]);

  const getCourseTypes = async (): Promise<Type[]> => {
    const cacheKey = 'courseTypes';

    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);

    const response = await fetch(`${API_URL}/courses.types.list`, {
      headers: {
        Authorization: API_KEY,
      },
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Error al obtener los tipos de curso');

    const types = await response.json();
    sessionStorage.setItem(cacheKey, JSON.stringify(types));
    return types;
  };

  const handleEdit = async (data: Course) => {
    try {
      const types = await getCourseTypes();

      const shifts = [
        { id: 7, name: 'Diario' },
        { id: 8, name: 'Sabatino' },
      ];

      const { value: result } = await Swal.fire({
        title: 'Editar Disciplina',
        html: `
          <input
            id="name"
            class="bg-white text-black dark:bg-boxdark-2 dark:text-white w-67 h-[2.625em] px-5 py-3 transition-shadow border border-gray-300 rounded shadow-inner text-inherit text-lg mt-4 mx-8 mb-1"
            placeholder="Nombre de la disciplina"
            value="${data.name}"
          />
          
          <select
            id="type"
            class="swal2-select bg-white text-black dark:bg-boxdark-2 dark:text-white w-67 h-[2.625em] px-5 py-3 transition-shadow border border-gray-300 rounded shadow-inner text-inherit text-lg mt-4 mx-8 mb-1"
          >
            ${types
              .map(
                (type: Type) => `
              <option value="${type.id}" ${
                data.type.id === type.id ? 'selected' : ''
              }>${type.name}</option>
            `,
              )
              .join('')}
          </select>
  
          <div id="shifts-container" class="inline-flex justify-center text-left mt-4 mx-8">
            <label class="block mb-1">
              <strong>Turnos:</strong>
              <span class="text-sm text-gray-500">(opcional)</span>
            </label>
            <div class="ml-2 flex gap-2 flex-col">
            ${shifts
              .map(
                (shift) => `
              <label>
                <input
                  type="checkbox"
                  value="${shift.id}"
                  ${
                    (data.shifts ?? []).some((s: Shift) => s.id === shift.id)
                      ? 'checked'
                      : ''
                  }
                />
                ${shift.name}
              </label>
            `,
              )
              .join('')}
            </div>
          </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        customClass: {
          popup: 'bg-white text-black dark:bg-boxdark-2 dark:text-white',
          confirmButton:
            'bg-blue-500 text-white dark:bg-boxdark dark:text-white',
          cancelButton:
            'bg-gray-300 text-black dark:bg-gray-700 dark:text-white',
        },
        preConfirm: () => {
          const name = (
            document.getElementById('name') as HTMLInputElement
          ).value.trim();
          const typeId = (document.getElementById('type') as HTMLSelectElement)
            .value;
          const checkboxes = document.querySelectorAll<HTMLInputElement>(
            '#shifts-container input[type="checkbox"]',
          );
          const selectedShifts = Array.from(checkboxes)
            .filter((cb) => cb.checked)
            .map((cb) => cb.value);

          if (!name || !typeId) {
            Swal.showValidationMessage(
              'El nombre y el tipo de disciplina son obligatorios',
            );
            return;
          }

          return {
            course_id: data.id,
            name,
            type_id: typeId,
            shifts: selectedShifts, // puede ser un array vacío []
          };
        },
      });

      if (result) {
        const response = await fetch(`${API_URL}/courses.update`, {
          method: 'POST',
          headers: {
            Authorization: API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(result),
          credentials: 'include',
        });

        if (response.ok) {
          Swal.fire(
            '¡Actualizado!',
            'La disciplina fue actualizada.',
            'success',
          );
          fetchData(); // recargar datos
        } else {
          throw new Error('Error al actualizar la disciplina');
        }
      }
    } catch (error) {
      console.error('Error al editar la disciplina:', error);
      Swal.fire('Error', 'Ocurrió un problema al cargar los datos.', 'error');
    }
  };

  const opcionesRenderer = (params: { data: Course }) => {
    return (
      <div className="flex gap-4 mt-1 justify-center">
        <button
          onClick={() => handleEdit(params.data)}
          className={clsx(colorVariants['white'].btnSc)}
        >
          <FaPencil size={20} />
        </button>
      </div>
    );
  };

  const columnDefs = useMemo(
    () => [
      { field: 'name', headerName: 'Disciplina' },
      { field: 'type.name', headerName: 'Tipo' },
      {
        headerName: 'Turno',
        valueGetter: (params: any) => getShiftsAsString(params.data.shifts),
      },
      { field: 'price', headerName: 'Precio', valueGetter: (params: any) => formatCurrency(params.data.price),},
      { field: 'total_of_students', headerName: 'Total de estudiantes' },
      /*{
        headerName: 'Opciones',
        cellRenderer: opcionesRenderer,
      },*/
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
        <div className="flex justify-center sm:justify-start sm:w-1/5 mb-4 sm:mb-6">
          <h1 className="text-title-md xl:text-title-md2 font-bold text-black dark:text-white">
            Disciplinas
          </h1>
        </div>

        <div className="flex justify-center sm:w-3/5 mb-4 sm:mb-6">
          <div className={clsx('relative w-full', colorVariants['white'].text)}>
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch size={16} />
            </span>
            <input
              type="text"
              placeholder="Buscar disciplina"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className={clsx(
                'w-full h-12 bg-white pl-9 pr-4 text-black focus:outline-none rounded-lg shadow-default',
                colorVariants['white'].inp,
              )}
            />
          </div>
        </div>

        <div className="flex justify-center sm:justify-end gap-4 sm:w-1/5 mb-6">
          <button
            className={clsx(
              'inline-flex items-center justify-center py-2.5 px-3',
              colorVariants['white'].btn,
            )}
          >
            Crear Disciplina
          </button>
        </div>
      </div>

      <div className="h-125 w-full">
        <AgGridReact
          ref={gridRef}
          theme={theme}
          rowData={filteredData}
          loading={loading}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowHeight={75}
        />
      </div>

      <div className="sm:flex justify-end gap-4 md:gap-6 my-6">
        <div className="sm:w-1/2 xl:w-1/4">
          <CardDataStats
            title="Total de disciplinas"
            total={rowData.length.toString()}
          >
            <FaStar className="fill-primary dark:fill-white" size={20} />
          </CardDataStats>
        </div>
      </div>
    </>
  );
};

export default Disciplines;

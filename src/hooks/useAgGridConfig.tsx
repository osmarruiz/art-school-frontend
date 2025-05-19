import { themeQuartz, colorSchemeLightCold, colorSchemeDarkBlue } from 'ag-grid-community';
import  useColorMode  from './useColorMode';
import { useMemo } from 'react';

const themeLightCold = themeQuartz.withPart(colorSchemeLightCold);
const themeDarkBlue = themeQuartz.withPart(colorSchemeDarkBlue);

export const useAgGridConfig = () => {
  const [colorMode] = useColorMode();

  const theme = useMemo(
    () => (colorMode === 'dark' ? themeDarkBlue : themeLightCold),
    [colorMode]
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      flex: 1,
      minWidth: 100,
    }),
    []
  );

  const localeText = useMemo(
    () => ({
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
    }),
    []
  );

  return { theme, defaultColDef, localeText };
};
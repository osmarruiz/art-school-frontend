/**
 * Normaliza un texto para búsquedas y comparaciones:
 * - Convierte a minúsculas
 * - Elimina espacios extras
 * - Elimina acentos/diacríticos
 * - Normaliza espacios múltiples
 * @param text Texto a normalizar
 * @returns Texto normalizado
 */
export const normalizeText = (text: string | null | undefined = ''): string => {
  if (text === null || text === undefined) {
    return '';
  }

  return text
    .toString() // Asegura que sea string
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
};

/**
 * Versión optimizada para búsquedas que no necesita normalizar espacios
 */
export const normalizeSearchText = (text: string = ''): string => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

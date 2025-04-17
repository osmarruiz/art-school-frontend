export const formatDateFlexible = (
  value: string | number,
  options: {
    type?: 'date' | 'time' | 'datetime' | 'month-year' | 'year';
    short?: boolean;
    withTimezoneOffset?: boolean;
  } = {}
): string => {
  const { type = 'datetime', short = false, withTimezoneOffset = false } = options;

  if (!value) return '—';

  let date: Date;

  if (typeof value === 'string') {
    date = new Date(value); // Intentar parsear la cadena tal cual
    if (withTimezoneOffset && !value.includes('T')) {
      // Si no tiene info de hora y queremos el offset, podemos manipular la Date
      const offsetMilliseconds = -6 * 60 * 60 * 1000; // -6 horas en milisegundos
      date = new Date(date.getTime() + offsetMilliseconds);
    }
  } else {
    date = new Date(value);
  }

  const locale = 'es-NI';

  const dateOpts: Intl.DateTimeFormatOptions = short
    ? {}
    : { year: 'numeric', month: 'long', day: 'numeric' };

  const timeOpts: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };

  const yearOpts: Intl.DateTimeFormatOptions = { year: 'numeric' };
  const monthYearOpts: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };

  switch (type) {
    case 'year':
      return date.toLocaleDateString(locale, yearOpts);
    case 'month-year':
      return date.toLocaleDateString(locale, monthYearOpts);
    case 'date':
      return date.toLocaleDateString(locale, dateOpts);
    case 'time':
      return date.toLocaleTimeString(locale, timeOpts);
    case 'datetime':
    default:
      return `${date.toLocaleDateString(locale, dateOpts)} ${date.toLocaleTimeString(locale, timeOpts)}`;
  }
};
export const formatDateFlexible = (
  value: string | number,
  options: {
    type?: 'date' | 'time' | 'datetime' | 'month-year';
    short?: boolean;
    withTimezoneOffset?: boolean;
  } = {}
): string => {
  const { type = 'datetime', short = false, withTimezoneOffset = false } = options;

  if (!value) return '—';

  let date: Date;

  if (typeof value === 'string' && withTimezoneOffset) {
    date = new Date(value + "T00:00:00-06:00");
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

  switch (type) {
    case 'month-year':
      return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
      });
    case 'date':
      return date.toLocaleDateString(locale, dateOpts);
    case 'time':
      return date.toLocaleTimeString(locale, timeOpts);
    case 'datetime':
    default:
      return `${date.toLocaleDateString(locale, dateOpts)} ${date.toLocaleTimeString(locale, timeOpts)}`;
  }
};

  
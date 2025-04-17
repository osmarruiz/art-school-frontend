export const formatCurrency = (
  amount: number,
  locale: string = 'es-NI',
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'NIO',
  }).format(amount);
};
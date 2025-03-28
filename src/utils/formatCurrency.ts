export const formatCurrency = (
  amount: number,
  locale: string = 'es-NI' // Nicaragua locale for Cordoba
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'NIO', // Cordoba currency code
  }).format(amount);
};
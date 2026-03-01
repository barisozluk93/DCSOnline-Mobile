export const isNullOrEmpty = (value) =>
  value === null ||
  value === undefined ||
  (typeof value === 'string' && value.trim() === '');

export const toFloat = (value) =>
  value === null ||
  value === undefined || 
  (typeof value === 'string' && parseFloat(value.replace(/,/g, '')));


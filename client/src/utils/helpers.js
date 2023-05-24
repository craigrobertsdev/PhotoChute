/**
 * Returns a date in the format DD/MM/YYYY
 * @param {Date} date
 * @returns The formatted date
 */
export function formatDate(date) {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

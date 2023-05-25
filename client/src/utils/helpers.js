/**
 * Returns a date in the format DD/MM/YYYY
 * @param {Date} date
 * @returns The formatted date
 */
export function formatDate(date) {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

/**
 * @param {Number} fileSize The size of a file in bytes
 * @returns The file size in MB, rounded to 1 decimal place
 */
export function sizeInMb(fileSize) {
  return Math.round((fileSize / 1000000) * 10) / 10;
}

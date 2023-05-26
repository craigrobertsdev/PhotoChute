/**
 * Returns a date in the format DD/MM/YYYY
 * @param {String} timeSinceEpoch The number of milliseconds since 1/1/70 as returned by Date.now()
 * @returns The formatted date
 */
export function formatDate(timeSinceEpoch) {
  const date = new Date(+timeSinceEpoch);

  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

/**
 * @param {Number} fileSize The size of a file in bytes
 * @returns The file size in MB, rounded to 1 decimal place
 */
export function sizeInMb(fileSize) {
  return Math.round((fileSize / 1000000) * 10) / 10;
}

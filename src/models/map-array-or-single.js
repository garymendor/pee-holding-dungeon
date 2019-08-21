/**
 * Normalizes a value as an array of something.
 * * If the value is falsy, return an empty array.
 * * If the value is not an array, return a single-element array with the value.
 * * If the value is already an array, return it.
 * @template T
 * @param {T[]|T|null} data
 * @returns {T[]}
 */
function mapArrayOrSingle(data) {
  if (!data) {
    return [];
  }
  if (!Array.isArray(data)) {
    return [data];
  }
  return data;
}

export default mapArrayOrSingle;

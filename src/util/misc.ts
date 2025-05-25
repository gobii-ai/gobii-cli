/**
 * Checks if a string is a valid JSON string
 * 
 * @param {string} str - The string to check
 * 
 * @returns {boolean} - True if the string is a valid JSON string, false otherwise
 */
export function isJsonString(str: string): boolean {
  try {
    const parsed = JSON.parse(str);
    // Optionally validate that it's an object or array, not just a number/string
    return typeof parsed === 'object' && parsed !== null;
  } catch (e) {
    return false;
  }
}

/**
 * The current exit code
 * 
 * @type {number}
 */
let exitCode = 0;

/**
 * Set the exit code - use POSIX exit codes > 0 to indicate failure. 0 is success. Once set to > 0, it cannot be reset to 0, and
 * the highest exit code will be used.
 * 
 * @param {number} code - The exit code to set
 */
export function setExitCode(code: number) {
  if (code > exitCode) {
    exitCode = code;
  }
}

/**
 * Get the current exit code
 * 
 * @returns {number} - The current exit code
 */
export function getExitCode(): number {
  return exitCode;
}

/**
 * Reset the exit code for tests. This is a workaround to allow tests to reset the exit code.
 * 
 * @returns {void}
 */
export function __resetExitCodeForTests() {
  if (process.env.NODE_ENV === 'test') {
    exitCode = 0;
  }
}

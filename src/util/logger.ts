
let verbose = false;
let silent = false;

/**
 * Set the logging options
 * 
 * @param {boolean} v - Whether to log verbose messages
 * @param {boolean} s - Whether to log silently
 */
export function setLoggingOptions({ verbose: v, silent: s }: { verbose?: boolean; silent?: boolean }) {
  verbose = !!v;
  silent = !!s;
}

/**
 * Log a message - prints unless in silent mode
 * 
 * @param {any[]} args - The arguments to log
 */
export function log(...args: any[]) {
  if (!silent) {
    console.log(...args);
  }
}

/**
 * Log a verbose message - prints only if in verbose mode
 * 
 * @param {any[]} args - The arguments to log
 */
export function logVerbose(...args: any[]) {
  if (verbose) {
    console.log('[verbose]', ...args);
  }
}

/**
 * Log an info message - only prints if not in silent mode
 * 
 * @param {any[]} args - The arguments to log
 */
export function logInfo(...args: any[]) {
  if (!silent) {
  console.log(...args);
  }
}

/**
 * Log an error message - always prints
 * 
 * @param {any[]} args - The arguments to log
 */
export function logError(...args: any[]) {
  if (!silent) {
  console.error('[error]', ...args);
  }
}

/**
 * Log a result message - always prints
 * 
 * @param {any[]} args - The arguments to log
 */
export function logResult(...args: any[]) {
  console.log(...args); // always print result, even in silent mode
}

/**
 * Check if the logger is in silent mode
 * 
 * @returns {boolean} - Whether the logger is in silent mode
 */
export function isSilent() {
  return silent;
}

/**
 * Check if the logger is in verbose mode
 * 
 * @returns {boolean} - Whether the logger is in verbose mode
 */
export function isVerbose() {
  return verbose;
}

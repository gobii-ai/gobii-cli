
let verbose = false;
let silent = false;

export function setLoggingOptions({ verbose: v, silent: s }: { verbose?: boolean; silent?: boolean }) {
  verbose = !!v;
  silent = !!s;
}

export function log(...args: any[]) {
  if (!silent) {
    console.log(...args);
  }
}

export function logVerbose(...args: any[]) {
  if (verbose) {
    console.log('[verbose]', ...args);
  }
}

export function logInfo(...args: any[]) {
  console.log(...args);
}

export function logError(...args: any[]) {
  console.error('[error]', ...args);
}

export function logResult(...args: any[]) {
  console.log(...args); // always print result, even in silent mode
}

export function isSilent() {
  return silent;
}

export function isVerbose() {
  return verbose;
}

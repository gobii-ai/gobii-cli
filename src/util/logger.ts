let verboseEnabled = false;

export function enableVerbose() {
  verboseEnabled = true;
}

export function logVerbose(...args: any[]) {
  if (verboseEnabled) {
    console.log('[verbose]', ...args);
  }
}

export function logInfo(...args: any[]) {
  console.log(...args);
}

export function logError(...args: any[]) {
  console.error('[error]', ...args);
}

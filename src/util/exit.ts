let exitCode = 0;

export function setExitCode(code: number) {
  if (code > exitCode) {
    exitCode = code;
  }
}

export function getExitCode(): number {
  return exitCode;
}

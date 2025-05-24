import { describe, it, expect, beforeEach } from 'vitest';
import { setExitCode, getExitCode, __resetExitCodeForTests } from '../../../src/util/exit';

describe('exit.ts', () => {
  // Reset the internal state before each test (bypassing module encapsulation)
  beforeEach(() => {
    // Vitest doesn't allow resetting internal module state directly,
    // but we can re-import the module to simulate it if needed.
    // For now, this is a workaround using setExitCode(0) — or you can refactor.
    __resetExitCodeForTests()
  });

  it('should start with an exit code of 0', () => {
    expect(getExitCode()).toBe(0);
  });

  it('should allow setting the exit code to a non-zero value', () => {
    setExitCode(1);
    expect(getExitCode()).toBe(1);
  });

  it('should not lower the exit code once set', () => {
    setExitCode(2);
    setExitCode(1); // attempt to lower it
    expect(getExitCode()).toBe(2);
  });

  it('should allow raising the exit code from a lower value', () => {
    setExitCode(1);
    setExitCode(3);
    expect(getExitCode()).toBe(3);
  });

  it('should ignore attempts to reset exit code to 0', () => {
    setExitCode(2);
    setExitCode(0);
    expect(getExitCode()).toBe(2);
  });
});

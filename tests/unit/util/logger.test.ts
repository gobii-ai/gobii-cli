import { describe, it, expect, vi } from 'vitest';
import { log, logVerbose, logResult, setLoggingOptions } from '../../../src/util/logger';

describe('logger', () => {
  it('should print with logResult regardless of verbosity', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    logResult('output');
    expect(spy).toHaveBeenCalledWith('output');
    spy.mockRestore();
  });

  it('should only call logVerbose when verbose is true', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    setLoggingOptions({ verbose: false, silent: false });
    logVerbose('nope');
    expect(spy).not.toHaveBeenCalled();

    setLoggingOptions({ verbose: true, silent: false });
    logVerbose('yep');
    expect(spy).toHaveBeenCalledWith('[verbose]', 'yep');

    spy.mockRestore();
  });
});

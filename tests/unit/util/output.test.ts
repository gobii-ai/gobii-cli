import { describe, it, expect, beforeEach } from 'vitest';
import {
  GobiiCliOutputType,
  setOutputConfig,
  getOutputConfig,
  setOutputType,
  getOutputType,
} from '../../../src/util/output';

describe('output.ts', () => {
  beforeEach(() => {
    // Reset to default before each test
    setOutputConfig({ type: GobiiCliOutputType.TEXT });
  });

  it('should default to TEXT output', () => {
    expect(getOutputType()).toBe(GobiiCliOutputType.TEXT);
    expect(getOutputConfig()).toEqual({ type: GobiiCliOutputType.TEXT });
  });

  it('should allow setting output type to JSON', () => {
    setOutputType(GobiiCliOutputType.JSON);
    expect(getOutputType()).toBe(GobiiCliOutputType.JSON);
    expect(getOutputConfig()).toEqual({ type: GobiiCliOutputType.JSON });
  });

  it('should allow setting full output config to JSON', () => {
    setOutputConfig({ type: GobiiCliOutputType.JSON });
    expect(getOutputType()).toBe(GobiiCliOutputType.JSON);
  });

  it('should reflect changes made by setOutputType after setOutputConfig', () => {
    setOutputConfig({ type: GobiiCliOutputType.JSON });
    setOutputType(GobiiCliOutputType.TEXT);
    expect(getOutputType()).toBe(GobiiCliOutputType.TEXT);
  });
});

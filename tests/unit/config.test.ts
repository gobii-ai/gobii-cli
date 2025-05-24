import { describe, it, expect, beforeEach } from 'vitest';
import { Config } from '../../src/config';

describe('config.ts', () => {
  beforeEach(() => {
    Config.apiKey = '';
  });

  it('should default to an empty API key', () => {
    expect(Config.apiKey).toBe('');
  });

  it('should allow setting the API key', () => {
    Config.apiKey = 'test-api-key';
    expect(Config.apiKey).toBe('test-api-key');
  });

  it('should persist changes across references', () => {
    Config.apiKey = 'persistent-key';
    const anotherRef = Config;
    expect(anotherRef.apiKey).toBe('persistent-key');
  });
});

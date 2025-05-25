import { describe, it, expect } from 'vitest';
import { isJsonString } from '../../../src/util/misc';

describe('misc.ts', () => {
  describe('isJsonString', () => {
    it('should return true for valid JSON objects', () => {
      expect(isJsonString('{"key": "value"}')).toBe(true);
      expect(isJsonString('{"nested": {"key": "value"}}')).toBe(true);
      expect(isJsonString('{"array": [1, 2, 3]}')).toBe(true);
    });

    it('should return true for valid JSON arrays', () => {
      expect(isJsonString('[1, 2, 3]')).toBe(true);
      expect(isJsonString('[{"key": "value"}]')).toBe(true);
      expect(isJsonString('[]')).toBe(true);
    });

    it('should return false for invalid JSON strings', () => {
      expect(isJsonString('not json')).toBe(false);
      expect(isJsonString('{unclosed object')).toBe(false);
      expect(isJsonString('[unclosed array')).toBe(false);
      expect(isJsonString('{"key": value}')).toBe(false);
    });

    it('should return false for non-object JSON values', () => {
      expect(isJsonString('"string"')).toBe(false);
      expect(isJsonString('42')).toBe(false);
      expect(isJsonString('true')).toBe(false);
      expect(isJsonString('null')).toBe(false);
    });
  });
}); 
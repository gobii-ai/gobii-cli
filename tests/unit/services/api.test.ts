import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchJson, postJson, fetchSuccess, debugFetch } from '../../../src/services/api';
import { logVerbose, logError } from '../../../src/util/logger';

// Mock the logger
vi.mock('../../../src/util/logger', () => ({
  logVerbose: vi.fn(),
  logError: vi.fn()
}));

describe('api.ts', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    global.fetch = mockFetch;
  });

  describe('debugFetch', () => {
    it('should log request details and return response', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ success: true }),
        headers: new Map([['content-type', 'application/json']]),
        status: 200,
        statusText: 'OK',
        text: async () => '{}',
        clone() { return this; }
      };
      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await debugFetch('test-url', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: 'data' })
      });

      expect(logVerbose).toHaveBeenCalledWith('--- FETCH DEBUG ---');
      expect(logVerbose).toHaveBeenCalledWith('URL:', 'test-url');
      expect(logVerbose).toHaveBeenCalledWith('Method:', 'POST');
      expect(logVerbose).toHaveBeenCalledWith('Headers:', { 'Content-Type': 'application/json' });
      expect(logVerbose).toHaveBeenCalledWith('Body:', JSON.stringify({ test: 'data' }));
      expect(result).toEqual(mockResponse);
    });

    it('should handle fetch errors', async () => {
      const error = new Error('Network error');
      mockFetch.mockRejectedValueOnce(error);

      await debugFetch('test-url');
      
      expect(logError).toHaveBeenCalledWith('Error fetching: ', 'test-url');
      expect(logError).toHaveBeenCalledWith(error);
    });

    it('should handle non-JSON responses', async () => {
      const mockResponse = {
        ok: true,
        headers: new Map([['content-type', 'text/plain']]),
        status: 200,
        statusText: 'OK',
        text: async () => 'plain text response',
        clone() { return this; }
      };
      mockFetch.mockResolvedValueOnce(mockResponse);

      await debugFetch('test-url');

      expect(logVerbose).toHaveBeenCalledWith('Response Text:', 'plain text response');
    });
  });

  describe('fetchJson', () => {
    it('should return JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
        headers: new Map([['content-type', 'application/json']]),
        status: 200,
        statusText: 'OK',
        text: async () => '{}',
        clone() { return this; }
      });

      const result = await fetchJson('test-endpoint', 'test-api-key');
      expect(result).toEqual({ success: true });
      expect(mockFetch).toHaveBeenCalledWith(
        'https://getgobii.com/api/v1/test-endpoint',
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Api-Key': 'test-api-key',
            'Content-Type': 'application/json'
          })
        })
      );
    });

    it('should throw error on non-OK response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Not Found'
      });

      await expect(fetchJson('test-endpoint', 'test-api-key'))
        .rejects
        .toThrow('HTTP 404: Not Found');
    });
  });

  describe('postJson', () => {
    it('should return JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
        headers: new Map([['content-type', 'application/json']]),
        status: 200,
        statusText: 'OK',
        text: async () => '{}',
        clone() { return this; }
      });

      const result = await postJson('test-endpoint', 'test-api-key', {
        body: JSON.stringify({ key: 'value' }),
      });
      expect(result).toEqual({ success: true });
      expect(mockFetch).toHaveBeenCalledWith(
        'https://getgobii.com/api/v1/test-endpoint',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'X-Api-Key': 'test-api-key',
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({ key: 'value' })
        })
      );
    });

    it('should throw error on non-OK response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'Bad Request'
      });

      await expect(postJson('test-endpoint', 'test-api-key', {
        body: JSON.stringify({ key: 'value' })
      }))
        .rejects
        .toThrow('HTTP 400: Bad Request');
    });
  });

  describe('fetchSuccess', () => {
    it('should return true on OK response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
        headers: new Map([['content-type', 'application/json']]),
        status: 200,
        statusText: 'OK',
        text: async () => '{}',
        clone() { return this; }
      });

      const result = await fetchSuccess('test-endpoint', 'test-api-key');
      expect(result).toBe(true);
    });

    it('should return false on fetch error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      const result = await fetchSuccess('bad-endpoint', 'test-api-key');
      expect(result).toBe(false);
      expect(logError).toHaveBeenCalledWith('Error fetching: ', 'bad-endpoint');
    });

    it('should return false on non-OK response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Not Found'
      });

      const result = await fetchSuccess('test-endpoint', 'test-api-key');
      expect(result).toBe(false);
    });
  });
});

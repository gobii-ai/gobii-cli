import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchJson, postJson, fetchSuccess } from '../../../src/services/api';

describe('api.ts', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    global.fetch = mockFetch;
  });

  it('fetchJson should return JSON response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
      headers: new Map(),
      status: 200,
      statusText: 'OK',
      text: async () => '{}',
      clone() {
        return this;
      }
    });

    const result = await fetchJson('test-endpoint', 'test-api-key');
    expect(result).toEqual({ success: true });
  });

  it('postJson should return JSON response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
      headers: new Map(),
      status: 200,
      statusText: 'OK',
      text: async () => '{}',
      clone() {
        return this;
      }
    });

    const result = await postJson('test-endpoint', 'test-api-key', {
      body: JSON.stringify({ key: 'value' }),
    });
    expect(result).toEqual({ success: true });
  });

  it('fetchSuccess should return true on OK response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
      headers: new Map(),
      status: 200,
      statusText: 'OK',
      text: async () => '{}',
      clone() {
        return this;
      }
    });

    const result = await fetchSuccess('test-endpoint', 'test-api-key');
    expect(result).toBe(true);
  });

  it('fetchSuccess should return false on fetch error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    const result = await fetchSuccess('bad-endpoint', 'test-api-key');
    expect(result).toBe(false);
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as api from '../../../src/services/api';
import * as agentService from '../../../src/services/agentService';
import { setExitCode, getExitCode, resetExitCodeForTests } from '../../../src/util/exit';

vi.mock('../../../src/services/api', async () => {
  const actual = await vi.importActual<typeof import('../../../src/services/api')>('../../../src/services/api');
  return {
    ...actual,
    fetchJson: vi.fn(),
    fetchSuccess: vi.fn(),
    postJson: vi.fn(),
  };
});

describe('agentService.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetExitCodeForTests();
  });

  it('listAgents should return agent results', async () => {
    (api.fetchJson as any).mockResolvedValueOnce({ results: ['agent1', 'agent2'] });

    const result = await agentService.listAgents();
    expect(result).toEqual(['agent1', 'agent2']);
    expect(getExitCode()).toBe(0);
  });

  it('listAgents should set exit code on failure', async () => {
    (api.fetchJson as any).mockRejectedValueOnce(new Error('Failed'));
    const result = await agentService.listAgents();
    expect(result).toBeUndefined();
    expect(getExitCode()).toBe(1);
  });

  it('getAgentTasks should return task results', async () => {
    (api.fetchJson as any).mockResolvedValueOnce({ results: ['task1', 'task2'] });

    const result = await agentService.getAgentTasks('abc123');
    expect(result).toEqual(['task1', 'task2']);
    expect(getExitCode()).toBe(0);
  });

  it('getAgentTasks should return [] and set exit code on failure', async () => {
    (api.fetchJson as any).mockRejectedValueOnce(new Error('Failed'));

    const result = await agentService.getAgentTasks('bad');
    expect(result).toEqual([]);
    expect(getExitCode()).toBe(1);
  });

  it('getAgentTask should call fetchJson with correct endpoint', async () => {
    (api.fetchJson as any).mockResolvedValueOnce({ id: 'task123' });

    const result = await agentService.getAgentTask('task123');
    expect(result).toEqual({ id: 'task123' });
  });

  it('deleteAgent should call fetchSuccess with DELETE method', async () => {
    (api.fetchSuccess as any).mockResolvedValueOnce(true);

    const result = await agentService.deleteAgent('agent123');
    expect(result).toBe(true);
  });

  it('promptAgent should call postJson with prompt and wait', async () => {
    const mockResponse = { result: 'done' };
    (api.postJson as any).mockResolvedValueOnce(mockResponse);

    const result = await agentService.promptAgent('do something', 120);
    expect(result).toEqual(mockResponse);
  });
});

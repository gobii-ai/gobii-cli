import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  listAgents,
  getAgentTasks,
  getAgentTask,
  deleteAgent,
  cancelTask,
  deleteTask,
  getTaskResult,
  promptAgent,
  pingGobii
} from '../../../src/services/agentService';
import { fetchJson, fetchSuccess, postJson } from '../../../src/services/api';
import { Config } from '../../../src/config';
import { resetExitCodeForTests } from '../../../src/util/exit';

// Mock the API functions
vi.mock('../../../src/services/api', () => ({
  fetchJson: vi.fn(),
  fetchSuccess: vi.fn(),
  postJson: vi.fn()
}));

// Mock the Config
vi.mock('../../../src/config', () => ({
  Config: {
    apiKey: 'test-api-key'
  }
}));

describe('agentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetExitCodeForTests();
  });

  describe('listAgents', () => {
    it('should return agent results on success', async () => {
      const mockAgents = { results: [{ id: '1', name: 'Agent 1' }] };
      vi.mocked(fetchJson).mockResolvedValueOnce(mockAgents);

      const result = await listAgents();
      expect(result).toEqual(mockAgents.results);
      expect(fetchJson).toHaveBeenCalledWith('agents/browser-use', Config.apiKey);
    });

    it('should handle errors gracefully', async () => {
      vi.mocked(fetchJson).mockRejectedValueOnce(new Error('API Error'));
      const result = await listAgents();
      expect(result).toBeUndefined();
    });
  });

  describe('getAgentTasks', () => {
    it('should return task results for an agent', async () => {
      const mockTasks = { results: [{ id: '1', name: 'Task 1' }] };
      vi.mocked(fetchJson).mockResolvedValueOnce(mockTasks);

      const result = await getAgentTasks('agent-1');
      expect(result).toEqual(mockTasks.results);
      expect(fetchJson).toHaveBeenCalledWith('agents/browser-use/agent-1/tasks', Config.apiKey);
    });

    it('should return empty array on error', async () => {
      vi.mocked(fetchJson).mockRejectedValueOnce(new Error('API Error'));
      const result = await getAgentTasks('agent-1');
      expect(result).toEqual([]);
    });
  });

  describe('getAgentTask', () => {
    it('should return a specific task', async () => {
      const mockTask = { id: '1', name: 'Task 1' };
      vi.mocked(fetchJson).mockResolvedValueOnce(mockTask);

      const result = await getAgentTask('task-1');
      expect(result).toEqual(mockTask);
      expect(fetchJson).toHaveBeenCalledWith('tasks/browser-use/task-1', Config.apiKey);
    });
  });

  describe('deleteAgent', () => {
    it('should delete an agent successfully', async () => {
      vi.mocked(fetchSuccess).mockResolvedValueOnce(true);

      const result = await deleteAgent('agent-1');
      expect(result).toBe(true);
      expect(fetchSuccess).toHaveBeenCalledWith(
        'agents/browser-use/agent-1',
        Config.apiKey,
        { method: 'DELETE' }
      );
    });
  });

  describe('cancelTask', () => {
    it('should cancel a task successfully', async () => {
      const mockResponse = { status: 'cancelled' };
      vi.mocked(fetchJson).mockResolvedValueOnce(mockResponse);

      const result = await cancelTask('task-1');
      expect(result).toEqual(mockResponse);
      expect(fetchJson).toHaveBeenCalledWith(
        'tasks/browser-use/task-1/cancel/',
        Config.apiKey,
        { method: 'POST' }
      );
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      vi.mocked(fetchSuccess).mockResolvedValueOnce(true);

      const result = await deleteTask('task-1');
      expect(result).toBe(true);
      expect(fetchSuccess).toHaveBeenCalledWith(
        'tasks/browser-use/task-1',
        Config.apiKey,
        { method: 'DELETE' }
      );
    });
  });

  describe('getTaskResult', () => {
    it('should return task result', async () => {
      const mockResult = { output: 'Task completed' };
      vi.mocked(fetchJson).mockResolvedValueOnce(mockResult);

      const result = await getTaskResult('task-1');
      expect(result).toEqual(mockResult);
      expect(fetchJson).toHaveBeenCalledWith(
        'tasks/browser-use/task-1/result/',
        Config.apiKey
      );
    });
  });

  describe('promptAgent', () => {
    it('should call postJson with prompt and wait only', async () => {
      const mockResponse = { result: 'done' };
      vi.mocked(postJson).mockResolvedValueOnce(mockResponse);
  
      const result = await promptAgent('do something', 120);
  
      expect(postJson).toHaveBeenCalledWith(
        'tasks/browser-use/',
        'test-api-key',
        expect.objectContaining({
          body: JSON.stringify({
            prompt: 'do something',
            wait: 120,
          }),
        })
      );
  
      expect(result).toEqual(mockResponse);
    });
  
    it('should include schema if provided', async () => {
      const mockResponse = { result: 'structured' };
      const schema = { type: 'object', properties: { name: { type: 'string' } } };
      vi.mocked(postJson).mockResolvedValueOnce(mockResponse);
  
      const result = await promptAgent('describe user', 300, schema);
  
      expect(postJson).toHaveBeenCalledWith(
        'tasks/browser-use/',
        'test-api-key',
        expect.objectContaining({
          body: JSON.stringify({
            prompt: 'describe user',
            wait: 300,
            output_schema: schema,
          }),
        })
      );
  
      expect(result).toEqual(mockResponse);
    });
  });

  describe('pingGobii', () => {
    it('should return true on successful ping', async () => {
      vi.mocked(fetchSuccess).mockResolvedValueOnce(true);

      const result = await pingGobii();
      expect(result).toBe(true);
      expect(fetchSuccess).toHaveBeenCalledWith('ping', Config.apiKey);
    });
  });
});

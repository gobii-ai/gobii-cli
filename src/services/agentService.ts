import { Config } from '../config';
import { setExitCode } from '../util/exit';
import { logError } from '../util/logger';
import { fetchJson, fetchSuccess, postJson } from './api';

export async function listAgents() {
  try {
    const agents = await fetchJson('agents/browser-use', Config.apiKey);

    return agents.results;
  } catch (error) {
    logError('Error listing agents');
    setExitCode(1);
    return
  }
}

export async function getAgentTasks(agentId: string) {
  try {
    const tasks = await fetchJson(`agents/browser-use/${agentId}/tasks`, Config.apiKey);

    return tasks.results;
  } catch (error) {
    logError('Error getting agent tasks');
    setExitCode(1);
    return [];
  }
}

export async function deleteAgent(agentId: string) {
  return await fetchSuccess(`agents/browser-use/${agentId}`, Config.apiKey, { method: 'DELETE' });
}

/**
 * Prompt to execute a task - all the agent and task magic happens automatically
 * 
 * @param {string} prompt - The prompt to send to the agent
 * @param {number} wait - The number of seconds to wait for the agent to complete the task
 * @returns {Promise<any>} - The response from the agent
 */
export async function promptAgent(prompt: string, wait: number = 600) {
  return await postJson(`tasks/browser-use/`, Config.apiKey, {
    body: JSON.stringify({
      prompt: prompt,
      wait: wait
    }),
  });
}
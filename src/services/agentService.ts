import { Config } from '../config';
import { setExitCode } from '../util/exit';
import { logError } from '../util/logger';
import { fetchJson, fetchSuccess, postJson } from './api';

/**
 * List all agents
 * 
 * @returns {Promise<any>} - The response from the agent
 */
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

/**
 * Get the tasks for an agent
 * 
 * @param {string} agentId - The ID of the agent
 * @returns {Promise<any>} - The response from the agent
 */
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

/**
 * Get a specific task on an agent
 * 
 * @param {string} taskId - The ID of the task
 * @returns {Promise<any>} - The response from the agent
 */
export async function getAgentTask(taskId: string) {
  return await fetchJson(`tasks/browser-use/${taskId}`, Config.apiKey);
}

/**
 * Delete an agent
 * 
 * @param {string} agentId - The ID of the agent
 * @returns {Promise<any>} - The response from the agent
 */
export async function deleteAgent(agentId: string) {
  return await fetchSuccess(`agents/browser-use/${agentId}`, Config.apiKey, { method: 'DELETE' });
}

/**
 * Cancel a task
 * 
 * @param {string} taskId - The ID of the task
 * @returns {Promise<any>} - The response from the agent
 */
export async function cancelTask(taskId: string) : Promise<any> {
  return await fetchJson(`tasks/browser-use/${taskId}/cancel/`, Config.apiKey, { method: 'POST' });
}

/**
 * Delete a task
 * 
 * @param {string} taskId - The ID of the task
 * @returns {Promise<boolean>} - The response from the agent. 
 */
export async function deleteTask(taskId: string) : Promise<boolean> {
  return await fetchSuccess(`tasks/browser-use/${taskId}`, Config.apiKey, { method: 'DELETE' });
}


/**
 * Get the result of a task
 * 
 * @param {string} taskId - The ID of the task
 * @returns {Promise<any>} - The response from the agent
 */
export async function getTaskResult(taskId: string) : Promise<any> {
  return await fetchJson(`tasks/browser-use/${taskId}/result/`, Config.apiKey);
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
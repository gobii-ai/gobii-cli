import { Config } from '../config';
import { fetchJson, fetchSuccess } from './api';

export async function listAgents() {
  
    try {
        const agents = await fetchJson('agents/browser-use', Config.apiKey);

        return agents.results;
    } catch (error) {
        console.error('Error listing agents');
        return 
    }

}

export async function getAgentTasks(agentId: string) {
    try {
        const tasks = await fetchJson(`agents/browser-use/${agentId}/tasks`, Config.apiKey);

        return tasks.results;
    } catch (error) {
        console.error('Error getting agent tasks');
        return [];
    }
}

export async function deleteAgent(agentId: string) {
  return await fetchSuccess(`agents/browser-use/${agentId}`, Config.apiKey, { method: 'DELETE' });
}

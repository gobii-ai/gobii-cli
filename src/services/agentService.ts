import { Config } from '../config';
import { fetchJson } from './api';

export async function listAgents() {
  
    try {
        const agents = await fetchJson('agents/browser-use', Config.apiKey);

        return agents.results;
    } catch (error) {
        console.error('Error listing agents');
        return 
    }

}

export async function getAgentInfo(agentId: string) {
  return await fetchJson(`agent/${agentId}`, Config.apiKey);
}

export async function deleteAgent(agentId: string) {
  return await fetchJson(`agent/${agentId}`, Config.apiKey, { method: 'DELETE' });
}

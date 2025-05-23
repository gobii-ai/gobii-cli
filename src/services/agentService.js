"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAgents = listAgents;
exports.getAgentTasks = getAgentTasks;
exports.deleteAgent = deleteAgent;
exports.promptAgent = promptAgent;
const config_1 = require("../config");
const api_1 = require("./api");
function listAgents() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const agents = yield (0, api_1.fetchJson)('agents/browser-use', config_1.Config.apiKey);
            return agents.results;
        }
        catch (error) {
            console.error('Error listing agents');
            return;
        }
    });
}
function getAgentTasks(agentId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tasks = yield (0, api_1.fetchJson)(`agents/browser-use/${agentId}/tasks`, config_1.Config.apiKey);
            return tasks.results;
        }
        catch (error) {
            console.error('Error getting agent tasks');
            return [];
        }
    });
}
function deleteAgent(agentId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, api_1.fetchSuccess)(`agents/browser-use/${agentId}`, config_1.Config.apiKey, { method: 'DELETE' });
    });
}
/**
 * Prompt to execute a task - all the agent and task magic happens automatically
 *
 * @param {string} prompt - The prompt to send to the agent
 * @param {number} wait - The number of seconds to wait for the agent to complete the task
 * @returns {Promise<any>} - The response from the agent
 */
function promptAgent(prompt_1) {
    return __awaiter(this, arguments, void 0, function* (prompt, wait = 600) {
        return yield (0, api_1.postJson)(`tasks/browser-use/`, config_1.Config.apiKey, {
            body: JSON.stringify({
                prompt: prompt,
                wait: wait
            }),
        });
    });
}

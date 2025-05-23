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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const agentService_1 = require("./services/agentService");
const config_1 = require("./config");
const table_1 = require("table");
const cli_spinners_1 = require("cli-spinners");
const ora_1 = __importDefault(require("ora"));
const logger_1 = require("./util/logger");
const createAgentsCommand = () => {
    const agents = new commander_1.Command('agents');
    agents
        .command('list')
        .description('List all agents')
        .action(() => {
        (0, agentService_1.listAgents)().then(agents => {
            //Transform the agents (array of objects) into an array of arrays
            const agentsTable = agents.map((agent) => [agent.id, agent.name, agent.created_at]);
            //Push the headers to the first row
            agentsTable.unshift(['ID', 'Name', 'Created At']);
            console.log((0, table_1.table)(agentsTable, {
                columns: {
                    0: { alignment: 'left' },
                    1: { alignment: 'left' },
                    2: { alignment: 'left' },
                }
            }));
        });
    });
    return agents;
};
const createAgentCommand = () => {
    const agent = new commander_1.Command('agent');
    agent
        .command('tasks')
        .description('Get tasks on a specific agent')
        .argument('<agentId>', 'Agent ID')
        .action((agentId) => {
        (0, agentService_1.getAgentTasks)(agentId).then(tasks => {
            const tasksTable = tasks.map((task) => [task.id, task.prompt, task.status, task.created_at, task.updated_at]);
            tasksTable.unshift(['ID', 'Prompt', 'Status', 'Created At', 'Updated At']);
            console.log((0, table_1.table)(tasksTable, {
                columns: {
                    0: { alignment: 'left' },
                    1: { alignment: 'left', wrapWord: true },
                    2: { alignment: 'left' },
                    3: { alignment: 'left' },
                    4: { alignment: 'left' },
                }
            }));
            console.log("Total tasks: ", tasks.length);
        });
    });
    agent
        .command('delete')
        .description('Delete a specific agent')
        .argument('<agentId>', 'Agent ID')
        .action((agentId) => {
        (0, agentService_1.deleteAgent)(agentId).then(delAgent => {
            if (delAgent) {
                console.log('Agent deleted successfully');
            }
            else {
                console.error('Failed to delete agent');
            }
        });
    });
    return agent;
};
const createPromptCommand = () => {
    const prompt = new commander_1.Command('prompt')
        .argument('<text>', 'Prompt text to create a new task')
        .description("Create a new task with a provided prompt")
        .action((text) => __awaiter(void 0, void 0, void 0, function* () {
        const spinner = (0, ora_1.default)({
            text: 'Executing prompt, this may take a while...',
            spinner: (0, cli_spinners_1.randomSpinner)(), // Custom spinner animation
        }).start();
        try {
            (0, agentService_1.promptAgent)(text, 600).then(result => {
                spinner.succeed('Prompt completed successfully!');
                console.log("Result:");
                console.log(result.result);
            }).catch(error => {
                spinner.fail('Failed to execute prompt');
                console.error(error);
            });
        }
        catch (error) {
            spinner.fail('Failed to send prompt');
            console.error(error);
        }
    }));
    return prompt;
};
const program = new commander_1.Command();
program
    .version('1.0.0')
    .name('gobii-cli')
    .option('-a, --api-key <apiKey>', 'API key')
    .option('-v, --verbose', 'Enable verbose logging');
program.addCommand(createAgentsCommand());
program.addCommand(createAgentCommand());
program.addCommand(createPromptCommand());
//Validate we have an API key
program.hook('preAction', (thisCommand) => {
    const opts = thisCommand.opts();
    if (opts.apiKey) {
        config_1.Config.apiKey = opts.apiKey;
    }
    else if (process.env.GOBII_API_KEY) {
        config_1.Config.apiKey = process.env.GOBII_API_KEY;
    }
    else {
        console.error('API Key must be set via --api-key or GOBII_API_KEY environment variable');
        process.exit(1);
    }
});
program.hook('preAction', (thisCommand) => {
    if (thisCommand.opts().verbose) {
        (0, logger_1.enableVerbose)();
    }
});
program.parseAsync(process.argv);

import { Command, Argument } from 'commander';
import { getAgentTasks, listAgents, deleteAgent, promptAgent } from './services/agentService';
import { Config } from './config';
import { table } from 'table';
import {randomSpinner} from 'cli-spinners';
import ora from 'ora';

const createAgentsCommand = (): Command => {
    const agents = new Command('agents');

    agents
        .command('list')
        .description('List all agents')
        .action(() => {
            listAgents().then(agents => {
                //Transform the agents (array of objects) into an array of arrays
                const agentsTable = agents.map((agent: any) => [agent.id, agent.name, agent.created_at]);

                //Push the headers to the first row
                agentsTable.unshift(['ID', 'Name', 'Created At']);

                console.log(table(agentsTable, {
                    columns: {
                        0: { alignment: 'left' },
                        1: { alignment: 'left' },
                        2: { alignment: 'left' },
                    }
                }));
            });
        });

    return agents;
}

const createAgentCommand = (): Command => {
    const agent = new Command('agent');
  
    agent
      .command('tasks')
      .description('Get tasks on a specific agent')
      .argument('<agentId>', 'Agent ID')
      .action((agentId) => {
        getAgentTasks(agentId).then(tasks => {
            const tasksTable = tasks.map((task: any) => [task.id, task.prompt, task.status, task.created_at, task.updated_at]);

            tasksTable.unshift(['ID', 'Prompt', 'Status', 'Created At', 'Updated At']);

            console.log(table(tasksTable, {
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
        deleteAgent(agentId).then(delAgent => {
            if (delAgent) {
                console.log('Agent deleted successfully');
            } else {
                console.error('Failed to delete agent');
            }
        });
      });
  
    return agent;
  }

const createPromptCommand = (): Command => {
  const prompt = new Command('prompt')
  .argument('<text>', 'Prompt text to create a new task')
  .description("Create a new task with a provided prompt")
  .action(async (text) => {
    const spinner = ora({
      text: 'Executing prompt, this may take a while...',
      spinner: randomSpinner(), // Custom spinner animation
    }).start();
    
    try {
      promptAgent(text, 600).then(result => {
        spinner.succeed('Prompt completed successfully!');
        console.log("Result:");
        console.log(result.result);
      }).catch(error => {
        spinner.fail('Failed to execute prompt');
        console.error(error);
      });
      
    } catch (error) {
      spinner.fail('Failed to send prompt');
      console.error(error);
    }
  });

    return prompt;
  }

const program = new Command();

program
    .version('1.0.0')
    .name('gobii-cli')
    .option('-a, --api-key <apiKey>', 'API key')

program.addCommand(createAgentsCommand());
program.addCommand(createAgentCommand());
program.addCommand(createPromptCommand());
    

//Validate we have an API key
program.hook('preAction', (thisCommand) => {
    const opts = thisCommand.opts();
    if (opts.apiKey) {
      Config.apiKey = opts.apiKey;
    } else if (process.env.GOBII_API_KEY) {
        Config.apiKey = process.env.GOBII_API_KEY;
    } else {
      console.error('API Key must be set via --api-key or GOBII_API_KEY environment variable');
      process.exit(1);
    }
  });
  
program.parseAsync(process.argv);
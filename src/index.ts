import { Command, Argument } from 'commander';
import { listAgents } from './services/agentService';
import { Config } from './config';
import { table } from 'table';
import { object } from 'zod';

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
      .command('info')
      .description('Get info on a specific agent')
      .argument('<agentId>', 'Agent ID')
      .action((agentId) => {
        console.log(`Showing info for agent: ${agentId}`);
      });
  
    agent
      .command('delete')
      .description('Delete a specific agent')
      .argument('<agentId>', 'Agent ID')
      .action((agentId) => {
        console.log(`Deleting agent: ${agentId}`);
      });
  
    return agent;
  }

const program = new Command();

program
    .version('1.0.0')
    .name('gobii-cli')
    .requiredOption('-a, --api-key <apiKey>', 'API key');

program.addCommand(createAgentsCommand());
program.addCommand(createAgentCommand());
    
program.hook('preAction', (thisCommand) => {
    const opts = thisCommand.opts();
    if (opts.apiKey) {
      Config.apiKey = opts.apiKey;
    } else {
      console.error('Missing required --api-key');
      process.exit(1);
    }
  });
  
program.parseAsync(process.argv);



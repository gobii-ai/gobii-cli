#!/usr/bin/env node

import { Command, Argument } from 'commander';
import { getAgentTasks, listAgents, deleteAgent, promptAgent } from './services/agentService';
import { Config } from './config';
import { table } from 'table';
import {randomSpinner} from 'cli-spinners';
import ora from 'ora';
import { log, logError, logResult, setLoggingOptions, isSilent } from './util/logger';
import { getExitCode, setExitCode } from './util/exit';

const createAgentsCommand = (): Command => {
    const agents = new Command('agents');

    agents
        .command('list')
        .description('List all agents')
        .action(async () => {
          try {
            const agents = await listAgents();
        
            if (!agents || agents.length === 0) {
              logResult('No agents found.');
              return;
            }
        
            const agentsTable = agents.map((agent: any) => [
              agent.id,
              agent.name,
              agent.created_at,
            ]);
        
            agentsTable.unshift(['ID', 'Name', 'Created At']);
        
            logResult(table(agentsTable, {
              columns: {
                0: { alignment: 'left' },
                1: { alignment: 'left' },
                2: { alignment: 'left' },
              },
            }));
          } catch (err) {
            logError('Failed to get agents');
            setExitCode(1);
          }
        });

    return agents;
}

const createAgentCommand = (): Command => {
  const agent = new Command('agent');

  agent
    .command('tasks')
    .description('Get tasks on a specific agent')
    .argument('<agentId>', 'Agent ID')
    .action(async (agentId: string) => {
      try {
        const tasks = await getAgentTasks(agentId);

        if (!tasks || tasks.length === 0) {
          log('No tasks found for this agent.');
          return;
        }

        const tasksTable = tasks.map((task: any) => [
          task.id,
          task.prompt,
          task.status,
          task.created_at,
          task.updated_at,
        ]);

        tasksTable.unshift(['ID', 'Prompt', 'Status', 'Created At', 'Updated At']);

        logResult(table(tasksTable, {
          columns: {
            0: { alignment: 'left' },
            1: { alignment: 'left', wrapWord: true },
            2: { alignment: 'left' },
            3: { alignment: 'left' },
            4: { alignment: 'left' },
          },
        }));

        log(`Total tasks: ${tasks.length}`);
      } catch (err) {
        logError('Failed to get tasks');
        logError(err);
        setExitCode(1);
      }
    });

  agent
    .command('delete')
    .description('Delete a specific agent')
    .argument('<agentId>', 'Agent ID')
    .action(async (agentId: string) => {
      try {
        const delAgent = await deleteAgent(agentId);

        if (delAgent) {
          log('Agent deleted successfully');
        } else {
          logError('Failed to delete agent');
          setExitCode(1);
        }
      } catch (err) {
        logError('Error deleting agent');
        logError(err);
        setExitCode(1);
      }
    });

  return agent;
};

const createPromptCommand = (): Command => {
  const prompt = new Command('prompt')
    .argument('<text>', 'Prompt text to create a new task')
    .description('Create a new task with a provided prompt')
    .action(async (text: string) => {
      const spinner = ora({
        text: 'Executing prompt, this may take a while...',
        spinner: randomSpinner(),
      });

      if (!isSilent()) {
        spinner.start();
      }

      try {
        const result = await promptAgent(text, 600);

        if (!isSilent()) {
          spinner.succeed('Prompt completed successfully!');
        }

        log('Result:');
        logResult(result.result);
      } catch (error) {
        if (!isSilent()) {
          spinner.fail('Failed to execute prompt');
        }

        logError('Error executing prompt:');
        logError(error);
        setExitCode(1);
      }
    });

  return prompt;
};

const program = new Command();

program
    .version('1.0.0')
    .name('gobii-cli')
    .option('-a, --api-key <apiKey>', 'API key')
    .option('-v, --verbose', 'Enable verbose logging')
    .option('-s, --silent', 'Suppress all output except final result. Verbose mode takes precedence over silent mode.');

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

program.hook('preAction', (thisCommand) => {
  const opts = thisCommand.opts();
  setLoggingOptions({ verbose: opts.verbose, silent: opts.silent });
});


process.on('unhandledRejection', (reason) => {
  logError('💥 Unhandled Rejection:', reason);
  process.exit(1);
});
  
async function main() {
  try {
    await program.parseAsync(process.argv);
  } catch (err) {
    logError('Fatal CLI error:', err);
    setExitCode(1);
  } finally {
    process.exit(getExitCode());
  }
}

main();
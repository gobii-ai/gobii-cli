#!/usr/bin/env node

import { Command, Argument } from 'commander';
import { getAgentTasks, listAgents, deleteAgent, promptAgent } from './services/agentService';
import { Config } from './config';
import { table } from 'table';
import { randomSpinner } from 'cli-spinners';
import ora from 'ora';
import { log, logError, logResult, setLoggingOptions, isSilent, setSilent } from './util/logger';
import { getExitCode, setExitCode } from './util/exit';
import { getOutputType, GobiiCliOutputType, setOutputConfig } from './util/output';

/**
 * Create the agents command
 * 
 * @returns {Command} - The command
 */
const createAgentsCommand = (): Command => {
  const agents = new Command('agents');

  agents.description('Manage agents');

  agents
    .command('list')
    .description('List all agents')
    .action(async () => {
      try {
        const agents = await listAgents();

        if (getOutputType() === GobiiCliOutputType.JSON) {
          logResult(JSON.stringify(agents, null, 2));
          return;
        } else {
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
        }
      } catch (err) {
        logError('Failed to get agents');
        setExitCode(1);
      }
    });

  return agents;
}

/**
 * Create the agent command
 * 
 * @returns {Command} - The command
 */
const createAgentCommand = (): Command => {
  const agent = new Command('agent');

  agent.description('Manage an individual agent');

  agent
    .command('tasks')
    .description('Get tasks on a specific agent')
    .argument('<agentId>', 'Agent ID')
    .action(async (agentId: string) => {
      try {
        const tasks = await getAgentTasks(agentId);

        if (getOutputType() === GobiiCliOutputType.JSON) {
          logResult(JSON.stringify(tasks, null, 2));
          return;
        } else {
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
        }
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

        if (getOutputType() === GobiiCliOutputType.JSON) {
          logResult(JSON.stringify(delAgent, null, 2));
        } else {
          if (delAgent) {
            log('Agent deleted successfully');
          } else {
            logError('Failed to delete agent');
            setExitCode(1);
          }
        }
      } catch (err) {
        logError('Error deleting agent');
        logError(err);
        setExitCode(1);
      }
    });

  return agent;
};

/**
 * Create the prompt command
 * 
 * @returns {Command} - The command
 */
const createPromptCommand = (): Command => {
  const prompt = new Command('prompt')
    .argument('<text>', 'Prompt text to create a new task')
    .description('Create a new task with a provided prompt')
    .action(async (text: string) => {

      let spinner: any;

      if (getOutputType() === GobiiCliOutputType.TEXT) {
        if (!isSilent()) {
          spinner = ora({
            text: 'Executing prompt, this may take a while...',
            spinner: randomSpinner(),
          });

          spinner.start();
        }
      }

      try {
        const result = await promptAgent(text, 900);

        if (getOutputType() === GobiiCliOutputType.JSON) {
          logResult(JSON.stringify(result, null, 2));
        } else {
          if (!isSilent()) {
            spinner.succeed('Prompt completed successfully!');
          }

          log('Result:');
          logResult(result.result);
        }
      } catch (error) {
        if (spinner) {
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
  .version('1.2.0')
  .name('gobii-cli')
  .option('-a, --api-key <apiKey>', 'API key')
  .option('-v, --verbose', 'Enable verbose logging. Not recommended when used with JSON output, as it will break JSON validation.')
  .option('-s, --silent', 'Suppress all output except final result. Verbose mode takes precedence over silent mode.')
  .option('-f, --format <format>', 'Output format. Currently only supports text or json. Default is text. In JSON mode, --silent is implied.', 'text');

program.addCommand(createPromptCommand());
program.addCommand(createAgentsCommand());
program.addCommand(createAgentCommand());

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

//Set logging options
program.hook('preAction', (thisCommand) => {
  const opts = thisCommand.opts();
  setLoggingOptions({ verbose: opts.verbose, silent: opts.silent });
});

//Set output options
program.hook('preAction', (thisCommand) => {
  const format = thisCommand.opts().format,
    isJson = format === 'json';

  if (!['text', 'json'].includes(format)) {
    console.error(`Invalid format: "${format}". Must be one of: text, json.`);
    process.exit(1);
  }
  
  setOutputConfig({ type: isJson  ? GobiiCliOutputType.JSON : GobiiCliOutputType.TEXT });

  if (isJson) {
    setSilent(true);
  }
});

//Handle unhandled rejections
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
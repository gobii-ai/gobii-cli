#!/usr/bin/env node

import { Command, Argument } from 'commander';
import { getAgentTasks, listAgents, deleteAgent, promptAgent, getAgentTask, cancelTask, getTaskResult, pingGobii, createTask } from './services/agentService';
import { Config } from './config';
import { table } from 'table';
import { randomSpinner } from 'cli-spinners';
import ora from 'ora';
import { log, logError, logResult, setLoggingOptions, isSilent, setSilent } from './util/logger';
import { getExitCode, resetExitCodeForTests, setExitCode } from './util/exit';
import { getOutputType, GobiiCliOutputType, setOutputConfig } from './util/output';
import { isJsonString } from './util/misc';
import fs from 'fs';

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
 * Create the task command
 * 
 * @returns {Command} - The command
 */
const createAgentTaskCommand = (): Command => {
  const agentTask = new Command('task');

  agentTask.description('Manage an individual agent task');

  agentTask
    .command('get')
    .description('Get a specific task on an agent')
    .argument('<taskId>', 'Task ID')
    .action(async (taskId: string) => {
      try {
        const task = await getAgentTask(taskId);

        if (getOutputType() === GobiiCliOutputType.JSON) {
          logResult(JSON.stringify(task, null, 2));
        } else {
          logResult('Task: ' + taskId);
          logResult('Prompt: ' + task.prompt);
          logResult('Status: ' + task.status);
          logResult('Agent: ' + task.agent);
          logResult('Agent ID: ' + task.agentId);
          logResult('Output Schema: ' + task.output_schema);
          logResult('Created At: ' + task.created_at);
          logResult('Updated At: ' + task.updated_at);
          logResult('Error Message: ' + task.error_message);
        }
      } catch (err) {
        logError('Failed to get task');
        logError(err);
        setExitCode(1);
      }
    });
  
  agentTask
    .command('cancel')
    .description('Cancel a specific task')
    .argument('<taskId>', 'Task ID')
    .action(async (taskId: string) => {
      try {
        const delTask = await cancelTask(taskId);

        if (getOutputType() === GobiiCliOutputType.JSON) {
          logResult(JSON.stringify(delTask, null, 2));
        } else {
          if (delTask) {
            log('Task deleted successfully');
          } else {
            logError('Failed to cancel task');
            setExitCode(1);
          }
        }
      } catch (err) {
        logError('Failed to cancel task');
      }
    });

  agentTask
    .command('result')
    .description('Get the result of a specific task')
    .argument('<taskId>', 'Task ID')
    .action(async (taskId: string) => {
      try {
        const result = await getTaskResult(taskId);

        if (getOutputType() === GobiiCliOutputType.JSON) {
          logResult(JSON.stringify(result, null, 2));
        } else {
          logResult('Result:');

          //If the result is a valid object, print as JSON and log it
          //Same with if it is a valid JSON string
          //Else - print the result as a string
          if (typeof result.result === 'object' && result.result !== null) {
            logResult(JSON.stringify(result.result, null, 2));
          } else if (typeof result.result === 'string' && isJsonString(result.result)) {
            logResult(JSON.stringify(JSON.parse(result.result), null, 2));
          } else {
            logResult(result.result);
          }
        }
      } catch (error) {
        logError('Failed to get task result');
      }
    });

  agentTask
    .command('create')
    .description('Create a new task with a provided prompt')
    .argument('<prompt>', 'Prompt to create a new task')
    .option('-w, --wait <wait>', 'Wait time in seconds for the prompt. If not provided, task will run asynchronously. Status may be checked with `gobii-cli task get <taskId>`')
    .option('-j, --schema <schema>', 'Output schema for the prompt. This is a JSON Schema (https://json-schema.org/) that will be used to validate the output of the prompt. If not provided, the output will be a string. Example: --schema \'{"type": "object", "properties": {"name": {"type": "string"}, "age": {"type": "number"}}}\'. NOTE: Use with --format=json')
    .option('-f, --schema-file <schemaFile>', 'Output schema for the prompt, provided as a file. This is a JSON Schema (https://json-schema.org/) that will be used to validate the output of the prompt. If not provided, the output will be a string. Example: --schema-file=schema.json. If both --schema and --schema-file are provided, --schema will take precedence. NOTE: Use with --format=json')
    .action(async (prompt: string) => {
      const opts = agentTask.opts();
      const wait = opts.wait;

      let schema = null;

      if (opts.schema) {
        try {
          schema = JSON.parse(opts.schema);
        } catch (error) {
          logError('Invalid schema');
          setExitCode(1);
          return
        }
      } else if (opts.schemaFile) {
        try {
          schema = JSON.parse(fs.readFileSync(opts.schemaFile, 'utf8'));
        } catch (error) {
          logError('Invalid schema file');
          setExitCode(1);
          return
        }
      }

      const result = await createTask(prompt, wait, schema);

      if (getOutputType() === GobiiCliOutputType.JSON) {
        logResult(JSON.stringify(result, null, 2));
      } else {
        if (wait !== null) {
          logResult('Task created successfully');
          logResult('Task ID: ' + result.id);
          logResult('Status may be checked with `gobii-cli task get ' + result.id + '`');
        } else {
          logResult('Task created: ');
          logResult(result.id);
          logResult('Result: ');
          logResult(result.result);
        }
      }
    });

  return agentTask;
};

/**
 * Create the ping command
 * 
 * @returns {Command} - The command
 */
const createPingCommand = (): Command => {
  const ping = new Command('ping');
  ping.description('Ping the Gobii API');
  ping.action(async () => {
    const result = await pingGobii();

    if (getOutputType() === GobiiCliOutputType.JSON) {
      logResult(result)
    } else {
      logResult(result ? 'Pong! 🤘' : 'Failed to ping Gobii');
    }

  });

  return ping;
}

/**
 * Create the prompt command
 * 
 * @returns {Command} - The command
 */
const createPromptCommand = (): Command => {
  const prompt = new Command('prompt')
    .argument('<text>', 'Prompt text to create a new task')
    .option('-j, --schema <schema>', 'Output schema for the prompt. This is a JSON Schema (https://json-schema.org/) that will be used to validate the output of the prompt. If not provided, the output will be a string. Example: --schema \'{"type": "object", "properties": {"name": {"type": "string"}, "age": {"type": "number"}}}\'. NOTE: Use with --format=json')
    .option('-c, --schema-file <schemaFile>', 'Output schema for the prompt, provided as a file. This is a JSON Schema (https://json-schema.org/) that will be used to validate the output of the prompt. If not provided, the output will be a string. Example: --schema-file=schema.json. If both --schema and --schema-file are provided, --schema will take precedence. NOTE: Use with --format=json')
    .option('-w, --wait <wait>', 'Wait time in seconds for the prompt. Default is 900 seconds. Must be a positive number <= 900', '900')
    .description('Create a new task with a provided prompt')
    .action(async (text: string) => {

      let spinner: any;

      const opts = prompt.opts();
      let schema = null;
      const wait = opts.wait;

      // Parse schema if it is provided
      if (opts.schema) {
        try {
          schema = JSON.parse(opts.schema);
        } catch (error) {
          logError('Invalid schema');
          setExitCode(1);
          return
        }
      } else if (opts.schemaFile) {
        try {
          schema = JSON.parse(fs.readFileSync(opts.schemaFile, 'utf8'));
        } catch (error) {
          logError('Invalid schema file');
          setExitCode(1);
          return
        }
      }

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
        const result = await promptAgent(text, wait, schema);

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
  .version('1.5.0')
  .name('gobii-cli')
  .option('-a, --api-key <apiKey>', 'API key')
  .option('-v, --verbose', 'Enable verbose logging. Not recommended when used with JSON output, as it will break JSON validation.')
  .option('-s, --silent', 'Suppress all output except final result. Verbose mode takes precedence over silent mode.')
  .option('-f, --format <format>', 'Output format. Currently only supports text or json. Default is text. In JSON mode, --silent is implied.', 'text');

program.addCommand(createPromptCommand());
program.addCommand(createAgentsCommand());
program.addCommand(createAgentCommand());
program.addCommand(createAgentTaskCommand());
program.addCommand(createPingCommand());

//Validate we have an API key
program.hook('preAction', (thisCommand) => {
  const opts = thisCommand.opts();
  if (opts.apiKey) {
    Config.apiKey = opts.apiKey;
  } else if (process.env.GOBII_API_KEY) {
    Config.apiKey = process.env.GOBII_API_KEY;
  } else {
    logError('API Key must be set via --api-key or GOBII_API_KEY environment variable');
    logError(''); //New line for readability
    logError('🚀 You can get an API key at https://gobii.ai/ 🤘');
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

  //Validate wait is a number, if it is provided
  if (thisCommand.opts().wait) {
    const wait = thisCommand.opts().wait;
    if (isNaN(wait) || wait > 900 || wait < 0) {
      logError('Wait must be a positive number <= 900, if provided');
      process.exit(1);
    }
  }
});

//Handle unhandled rejections
process.on('unhandledRejection', (reason) => {
  logError('💥 Unhandled Rejection:', reason);
  process.exit(1);
});


async function main() {
  //This is a workaround for testing; this should never be called outside of tests, OR right here.
  resetExitCodeForTests();

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
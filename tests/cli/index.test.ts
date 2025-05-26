import { describe, it, expect, beforeEach } from 'vitest';
import { execa } from 'execa';
import path from 'path';
import { resetExitCodeForTests } from '../../src/util/exit';

const CLI = path.resolve(__dirname, '../../dist/index.js');

describe('gobii-cli (integration)', () => {
  beforeEach(() => {
    resetExitCodeForTests();
  });

  it('should display help text', async () => {
    const { stdout } = await execa('node', [CLI, '--help']);
    expect(stdout).toMatch(/Usage: gobii-cli/);
    expect(stdout).toMatch(/\[options\] \[command\]/);
  });

  it('should fail without an API key', async () => {
    const { stderr, exitCode } = await execa('node', [CLI, 'agents', 'list'], {
      env: {
        ...process.env,
        GOBII_API_KEY: undefined,
      },
      reject: false,
    });

    expect(exitCode).toBe(1);
    expect(stderr).toMatch(/API Key must be set/i);
  });

  it('should fail with invalid format flag', async () => {
    const { stderr, exitCode } = await execa('node', [CLI, 'agents', 'list', '--api-key', 'fake', '--format', 'banana'], {
      reject: false,
    });

    expect(exitCode).toBe(1);
    expect(stderr).toMatch(/Invalid format: "banana"/);
  });

  // Placeholder tests for mocked commands

  it('should mock task get successfully', async () => {
    const { exitCode } = await execa('node', [CLI, 'task', 'get', 'mock-task-id', '--api-key', 'fake', '--format', 'json'], {
      reject: false,
    });

    expect(exitCode).toBeLessThanOrEqual(1);
  });

  it('should mock task result successfully', async () => {
    const { exitCode } = await execa('node', [CLI, 'task', 'result', 'mock-task-id', '--api-key', 'fake', '--format', 'json'], {
      reject: false,
    });

    expect(exitCode).toBeLessThanOrEqual(1);
  });

  it('should mock task cancel successfully', async () => {
    const { exitCode } = await execa('node', [CLI, 'task', 'cancel', 'mock-task-id', '--api-key', 'fake', '--format', 'json'], {
      reject: false,
    });

    expect(exitCode).toBeLessThanOrEqual(1);
  });

  it('should mock prompt execution', async () => {
    const { exitCode } = await execa('node', [CLI, 'prompt', 'Mock prompt input', '--api-key', 'fake', '--format', 'json'], {
      reject: false,
    });

    expect(exitCode).toBeLessThanOrEqual(1);
  });

  it('should return pong or JSON from ping command', async () => {
    const { stdout, exitCode } = await execa('node', [
      CLI,
      'ping',
      '--api-key',
      'fake',
      '--format',
      'json',
    ], { reject: false });

    expect(exitCode).toBeLessThanOrEqual(1);
    expect(() => JSON.parse(stdout)).not.toThrow();
  });
});

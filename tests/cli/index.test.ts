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
    expect(stdout).toMatch(/prompt <text>/);
  });

  it('should fail without an API key', async () => {
    const { stderr, exitCode } = await execa('node', [CLI, 'agents', 'list'], {
      env: {
        ...process.env,
        GOBII_API_KEY: undefined, // ❌ force the CLI to treat it as "unset"
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

  it('should succeed and return something (mock or real) with valid args', async () => {
    //Note this test requires a real api key to be set in your environment.
    const { stdout, exitCode } = await execa('node', [
      CLI,
      'agents',
      'list',
      '--silent'
    ], { reject: false });

    expect(exitCode).toBe(0);
    expect(stdout.length).toBeGreaterThan(0);
  });
});

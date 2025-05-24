# gobii-cli

An unofficial command-line interface for interacting with [Gobii](https://getgobii.com) prompts, agents and tasks. Gobii is a tool for browser automation using AI that provides the ability to perform complex web tasks without an API.

This is very early in development and *will* have bugs. 

You must have a Gobii API key. You may either define an environment variable $GOBII_API_KEY, or specifiy it as a command line argument (see below). Argument takes precedene over environment variable.

`gobii-cli` using exit codes `> 0` in compliance with POSIX to enable detection of success or failure. This is handy for automated use scenarios. 

## 🚀 Usage

```bash
gobii-cli [options] [command]
```

### 🔧 Options

- `-a, --api-key <key>` – API key for authentication
- `-f, --format` - Output format. Currently only supports text or json. Default is text. In JSON mode, --silent is implied. Great for piping to `jq`, etc!
- `-v, --verbose` – Enable verbose logging. Not recommended in JSON mode, as you may break valid JSON formatting.
- `-s, --silent` - Silence output except for results. Note: verbose takes precendence
- `-V, --version` – Output the CLI version
- `-h, --help` – Display help for command

## 🧭 Commands

### `prompt <text>`

Create a new task with a provided prompt.

```bash
gobii-cli prompt "Generate daily summary"
```

Sends the given prompt to create a task.

---

### `agents`

Manage agents.

```bash
gobii-cli agents list
```

Lists all registered agents.

---

### `agent`

Interact with a specific agent.

```bash
gobii-cli agent tasks <agentId>
```

Lists tasks associated with an agent.

```bash
gobii-cli agent delete <agentId>
```

Deletes a specific agent.

---

## 🔐 Authentication

You must provide an API key with each command. This can be passed via:

**Option:**

```bash
gobii-cli agents list --api-key your-api-key
```

**Environment variable:**

```bash
export GOBII_API_KEY=your-api-key
```

---

## 🪵 Verbose Mode

Enable debug output for deeper insight into requests and operations:

```bash
gobii-cli agent tasks abc123 --verbose
```

---

## 🧪 Example

```bash
gobii-cli prompt "Summarize my last 10 tasks" --api-key abc123 --verbose
```

---

## 🛠 Development

Clone the repo and run locally with:

```bash
npm install
npm run dev -- <command>
```

This project is licensed under the [Apache License 2.0](LICENSE).

No warranties, express or implied.

Copyright © 2025 Will Bonde.

[![npm version](https://badge.fury.io/js/gobii-cli.svg)](https://www.npmjs.com/package/gobii-cli)

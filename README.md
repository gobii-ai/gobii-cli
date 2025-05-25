# gobii-cli

An unofficial command-line interface for interacting with [Gobii](https://gobii.ai) prompts, agents, and tasks. Gobii is a tool for browser automation using AI that provides the ability to perform complex web tasks without an API.

This is early in development and *will* have bugs.

You must have a Gobii API key. You may either define an environment variable `$GOBII_API_KEY`, or specify it as a command-line argument. The argument takes precedence over the environment variable.

`gobii-cli` uses POSIX-compliant exit codes (`0` for success, `> 0` for failure), making it suitable for scripting and automation.

---

## 🚀 Usage

```bash
gobii-cli [options] [command]
```

### 🔧 Options

- `-a, --api-key <key>` – API key for authentication
- `-f, --format <format>` – Output format: `text` or `json` (default: `text`). In JSON mode, `--silent` is implied. Great for piping to tools like `jq`.
- `-v, --verbose` – Enable verbose logging (avoid with `--format json`, as it breaks JSON structure)
- `-s, --silent` – Suppress all output except final result. (`--verbose` overrides)
- `-V, --version` – Output the CLI version
- `-h, --help` – Display help for command

---

## 🧭 Commands

### `prompt <text>`

Submit a prompt to the Gobii API and wait for a result.

```bash
gobii-cli prompt "Generate daily summary"
```

---

### `ping`

Check connectivity with the Gobii API.

```bash
gobii-cli ping
```

Returns `Pong! 🤘` or a JSON object depending on format.

---

### `agents list`

List all registered agents.

```bash
gobii-cli agents list
```

---

### `agent tasks <agentId>`

List tasks associated with a specific agent.

```bash
gobii-cli agent tasks <agentId>
```

---

### `agent delete <agentId>`

Delete a specific agent.

```bash
gobii-cli agent delete <agentId>
```

---

### `task get <taskId>`

Retrieve metadata for a specific task.

```bash
gobii-cli task get <taskId>
```

---

### `task cancel <taskId>`

Cancel a specific task.

```bash
gobii-cli task cancel <taskId>
```

---

### `task result <taskId>`

Fetch the result of a completed task.

```bash
gobii-cli task result <taskId>
```

---

## 🔐 Authentication

You must provide an API key for all commands that interact with the Gobii service. You can do this in two ways:

**Command-line argument:**

```bash
gobii-cli agents list --api-key your-api-key
```

**Environment variable:**

```bash
export GOBII_API_KEY=your-api-key
```

---

## 🪵 Verbose Mode

To enable debug logging:

```bash
gobii-cli agent tasks abc123 --verbose
```

Use with caution in `--format json` mode, as it may break structured output.

---

## 🧪 Example

```bash
gobii-cli prompt "What was the weather like in Washington, DC on June 16, 2024?" --api-key abc123 --format json
```

---

## 🛠 Development

Clone the repo and run locally with:

```bash
npm install
npm run dev -- <command>
```

---

## 📝 License

This project is licensed under the [Apache License 2.0](LICENSE).  
No warranties, express or implied.

© 2025 Will Bonde

[![npm version](https://badge.fury.io/js/gobii-cli.svg)](https://www.npmjs.com/package/gobii-cli)

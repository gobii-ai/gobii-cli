# gobii-cli

An unofficial command-line interface for interacting with [Gobii](https://gobii.ai) prompts, agents, and tasks. Gobii is a tool for browser automation using AI that provides the ability to perform complex web tasks without an API.

This is early in development and *will* have bugs.

You must have a Gobii API key. You may either define an environment variable `$GOBII_API_KEY`, or specify it as a command-line argument. The argument takes precedence over the environment variable.

`gobii-cli` uses POSIX-compliant exit codes (`0` for success, `> 0` for failure), making it suitable for scripting and automation.

I highly recommend using the `prompt` command combined with JSON format to pipe data to `jq` or other tools.

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

**Options:**

- `-j, --schema <schema>` – Output schema for the prompt (JSON Schema string). Used to validate the prompt’s output structure. Example:
  ```bash
  --schema '{"type": "object", "properties": {"name": {"type": "string"}, "age": {"type": "number"}}}'
  ```

- `-f, --schema-file <file>` – Path to a file containing a JSON Schema used to validate output. Example:
  ```bash
  --schema-file ./schema.json
  ```

  > Note: If both `--schema` and `--schema-file` are provided, `--schema` takes precedence.

- `-w, --wait <seconds>` – Time in seconds to wait for the result. Default is `900`. Must be `1–900`.

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
gobii-cli agent tasks abc123
```

---

### `agent delete <agentId>`

Delete a specific agent.

```bash
gobii-cli agent delete abc123
```

---

### `task get <taskId>`

Retrieve metadata for a specific task.

```bash
gobii-cli task get task-xyz
```

---

### `task cancel <taskId>`

Cancel a specific task.

```bash
gobii-cli task cancel task-xyz
```

---

### `task result <taskId>`

Fetch the result of a completed task.

```bash
gobii-cli task result task-xyz
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

```bash
gobii-cli prompt "Get the the square footage and property age for 2343 Valley View Terrace, Driftshore Bay, DE from Zillow" --format=json --schema='{"type": "object", "properties": {"squareFootage": {"type": "number"}, "propertyAge": {"type": "number"}}, "required":  [], "additionalProperties": false}'


{
  "id": "0beb69b7-ac2a-42b1-8fae-1c7d457fc7c6",
  "agent_id": null,
  "result": {
    "propertyAge": 36,
    "squareFootage": 2858
  },
  "status": "completed",
  "agent": null,
  "prompt": "Get the the square footage and property age for 2343 Valley View Terrace, Driftshore Bay, DE from Zillow",
  "output_schema": {
    "type": "object",
    "properties": {
      "squareFootage": {
        "type": "number"
      },
      "propertyAge": {
        "type": "number"
      }
    },
    "required": [],
    "additionalProperties": false
  },
  "created_at": "2025-05-25T16:07:39.876836Z",
  "updated_at": "2025-05-25T16:07:39.876854Z",
  "error_message": null
}
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

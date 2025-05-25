# gobii-cli

## 1.4.0

### Minor Changes

- 1f0ee24: Added ping API support
- 1f0ee24: Adding integration testing via execa
- 1f0ee24: Adding `task get` command
- 1f0ee24: Added support for getting task result explicitly by ID, without additional information on the task
- 1f0ee24: Adding unit testing
- 1f0ee24: Updated integration tests for new commands
- 1f0ee24: Updated Gobii URLs
- 1f0ee24: Updated no API key error to reference where to get one

## 1.2.0

### Minor Changes

- Added --format switch, with the options of json and text. JSON is useful for piping to other tools, such as jq. Default format is text
- Improve code documentation for other developers

### Patch Changes

- Fixed printing of wrong version on help screen

## 1.1.0

### Minor Changes

- Added POSIX compliant exit codes to add in detection of success/failure in automated usage
- Added silent mode to produce no output, except results.
- Improved --verbose support with centralized logging control

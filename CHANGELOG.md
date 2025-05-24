# gobii-cli

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

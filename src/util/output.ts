/**
 * Output type enum
 * 
 * @enum {string}
 */
export enum GobiiCliOutputType {
  JSON = 'json',
  TEXT = 'text',
}

/**
 * The output config. Currently only supports text or json output flagging, but will be expanded in future
 * 
 * @type {GobiiCliOutputConfig}
 */
type GobiiCliOutputConfig = {
  type: GobiiCliOutputType;
};

/**
 * The current output config
 * 
 * @type {GobiiCliOutputConfig}
 */
let outputConfig: GobiiCliOutputConfig = {
  type: GobiiCliOutputType.TEXT,
};

/**
 * Set the output config
 * 
 * @param {GobiiCliOutputConfig} config - The output config
 */
export function setOutputConfig(config: GobiiCliOutputConfig) {
  outputConfig = config;
}

/**
 * Get the current output config
 * 
 * @returns {GobiiCliOutputConfig} - The current output config
 */
export function getOutputConfig(): GobiiCliOutputConfig {
  return outputConfig;
}

/**
 * Set the output type
 * 
 * @param {GobiiCliOutputType} type - The output type
 */
export function setOutputType(type: GobiiCliOutputType) {
  outputConfig.type = type;
}

/**
 * Get the current output type
 * 
 * @returns {GobiiCliOutputType} - The current output type
 */
export function getOutputType(): GobiiCliOutputType {
  return outputConfig.type;
}
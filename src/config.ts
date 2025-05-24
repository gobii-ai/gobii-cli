/**
 * The configuration for the CLI
 * 
 * @type {Object}
 */
type GobiiCliConfig = {
  apiKey: string; // The API key for the Gobii API; will be set from the environment variable GOBII_API_KEY or passed in as a command line argument
                  // command line argument takes precedence over environment variable, and is required if not set in the environment variable
};

/**
 * The configuration for the CLI
 * 
 * @type {Object}
 */
export const Config: GobiiCliConfig = {
  apiKey: '',
};
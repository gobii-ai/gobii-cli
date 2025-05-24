import { logError, logVerbose } from "../util/logger";

export async function debugFetch(
  url: string,
  options: RequestInit = {}
): Promise<any> {
  logVerbose('--- FETCH DEBUG ---');
  logVerbose('URL:', url);
  logVerbose('Method:', options.method || 'GET');
  logVerbose('Headers:', options.headers);

  if (options.body) {
    logVerbose('Body:', typeof options.body === 'string' ? options.body : '[non-string body]');
  } else {
    logVerbose('No body');
  }

  let response;

  try {
    logVerbose('Fetching...');
    response = await fetch(url, options);

    logVerbose('Status:', response.status, response.statusText);
    logVerbose('Response Headers:');

    response.headers.forEach((value: string, key: string) => {
      logVerbose(`  ${key}: ${value}`);
    });

    const contentType = response.headers.get('content-type') || '';

    let body;

    if (contentType.includes('application/json')) {
      body = await response.clone().json();
      logVerbose('Response JSON:', body);
    } else {
      body = await response.clone().text();
      logVerbose('Response Text:', body);
    }
  } catch (error) {
    logError('Error fetching: ', url);
    logError(error);
  }

  logVerbose('--- END FETCH DEBUG ---');

  return response;
}

/**
 * Base fetch function
 * 
 * @param endpoint - The endpoint to fetch
 * @param apiKey - The API key to use
 * @param options - The options to pass to the fetch request
 * 
 * @returns The response
 */
async function baseFetch(
    endpoint: string,
    apiKey: string,
    options: RequestInit = {}
  ): Promise<any> {
    const url = `https://getgobii.com/api/v1/${endpoint}`

    logVerbose('Fetching: ', url);

    if (!options.method) {
      options.method = 'GET';
    }

    const response = await debugFetch(url, {
      ...options,
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
  
    if (!response?.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    } else {
      logVerbose('Response OK');
    }
  
    return response;
  }
  
  /**
   * Base POST fetch function
   * 
   * @param endpoint - The endpoint to fetch
   * @param apiKey - The API key to use
   * @param options - The options to pass to the fetch request; body is required and a string. This expects any prep to already be done, ex: JSON.stringify({})
   * 
   * @returns The response object
   */
async function basePost(
  endpoint: string,
  apiKey: string,
  options: RequestInit = {}
): Promise<any> {
  const url = `https://getgobii.com/api/v1/${endpoint}`

  const response = await debugFetch(url, {
    ...options,
    method: 'POST',
    headers: {
      'X-Api-Key': apiKey,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: options.body,
  });

  if (!response?.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }

  logVerbose('Response: ', JSON.stringify(response, null, 2));

  return response;
}


/**
 * Fetch a resource and return the JSON response
 * 
 * @param endpoint - The endpoint to fetch
 * @param apiKey - The API key to use
 * @param options - The options to pass to the fetch request
 * 
 * @returns The JSON response
 */
export async function fetchJson(endpoint: string, apiKey: string, options: RequestInit = {}) {
    const response = await baseFetch(endpoint, apiKey, options);

    return response.json();
}

/**
 * Post a resource and return the JSON response
 * 
 * @param endpoint - The endpoint to fetch
 * @param apiKey - The API key to use
 * @param options - The options to pass to the fetch request
 * 
 * @returns The JSON response
 */
export async function postJson(endpoint: string, apiKey: string, options: RequestInit = {}) {
    const response = await basePost(endpoint, apiKey, options);

    return response.json();
}

/**
 * Fetch a resource and return true if the request was successful, false otherwise
 * 
 * @param endpoint - The endpoint to fetch
 * @param apiKey - The API key to use
 * @param options - The options to pass to the fetch request
 * 
 * @returns True if the request was successful, false otherwise
 */
export async function fetchSuccess(endpoint: string, apiKey: string, options: RequestInit = {}) {
    try {
        const response = await baseFetch(endpoint, apiKey, options);

        if (response?.ok) {
            return true;
        }
    } catch (error) {
        logError('Error fetching: ', endpoint);
        logError(error);
    }

    return false;
}
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

    console.log('Fetching: ', url);


    const response = await fetch(url, {
      ...options,
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
  
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
  
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

        if (response.ok) {
            return true;
        }
    } catch (error) {
        //TODO: Log the error
    }



    return false;
}
export async function fetchJson(
    endpoint: string,
    apiKey: string,
    options: RequestInit = {}
  ): Promise<any> {
    const url = `https://getgobii.com/api/v1/${endpoint}`

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
  
    return await response.json();
  }
  
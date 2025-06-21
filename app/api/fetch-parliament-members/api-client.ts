import { PARLIAMENT_API_CONFIG } from './constants';
import { ParliamentResponse } from './types';

/**
 * API client for fetching parliament data
 */
export class ParliamentApiClient {
  /**
   * Fetches parliament member data from the Austrian Parliament API
   */
  static async fetchParliamentData(): Promise<ParliamentResponse> {
    const response = await fetch(PARLIAMENT_API_CONFIG.URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': PARLIAMENT_API_CONFIG.USER_AGENT,
      },
      body: JSON.stringify(PARLIAMENT_API_CONFIG.POST_BODY),
    });

    if (!response.ok) {
      throw new Error(`Parliament API responded with status: ${response.status}`);
    }

    const data: ParliamentResponse = await response.json();
    console.log(`Fetched parliament data successfully: ${data.count} members`);
    
    return data;
  }
} 
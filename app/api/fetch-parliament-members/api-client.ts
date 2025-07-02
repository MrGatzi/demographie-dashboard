import { PARLIAMENT_API_CONFIG } from "./constants";
import { DetailedMemberResponse, ParliamentResponse } from "./types";

export class ParliamentApiClient {
  static async fetchParliamentData(): Promise<ParliamentResponse> {
    const response = await fetch(PARLIAMENT_API_CONFIG.URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": PARLIAMENT_API_CONFIG.USER_AGENT,
      },
      body: JSON.stringify(PARLIAMENT_API_CONFIG.POST_BODY),
    });

    if (!response.ok) {
      throw new Error(
        `Parliament API responded with status: ${response.status}`
      );
    }

    const data: ParliamentResponse = await response.json();
    console.log(`Fetched parliament data successfully: ${data.count} members`);
    return data;
  }

  static async fetchDetailedMemberData(
    memberId: string
  ): Promise<DetailedMemberResponse> {
    const url = `${PARLIAMENT_API_CONFIG.BASE_URL}/person/${memberId}?json=true`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": PARLIAMENT_API_CONFIG.USER_AGENT,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch detailed data for member ${memberId}: ${response.status}`
      );
    }

    const data = (await response.json()) as DetailedMemberResponse;
    return data;
  }

  static extractMemberId(profileUrl: string): string | null {
    const match = profileUrl.match(/\/person\/(\d+)/);
    return match ? match[1] : null;
  }
}

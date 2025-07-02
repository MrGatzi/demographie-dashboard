import { PARTY_COLORS, STATE_NAMES } from "./constants";
import {
  DetailedMemberResponse,
  DistrictData,
  ParsedMemberData,
  PartyData,
  StateData,
} from "./types";

/**
 * Parses raw member data from the parliament API response
 */
export function parseMemberData(member: string[]): ParsedMemberData {
  // Extract full name from index 0: "Auer Katrin, Mag."
  const fullName = member[0] || "Unknown Member";

  // Extract party from index 1: "<span title=\"...\">SPÖ</span>"
  const partyHtml = member[1] || "";
  const partyMatch = partyHtml.match(/>([^<]+)</);
  const party = partyMatch ? partyMatch[1] : "Independent";

  // Extract electoral district from index 2: "4D Traunviertel"
  const electoralDistrict = member[2] || "Unknown District";

  // Extract state from index 3: "<span title=\"Oberösterreich\">O</span>"
  const stateHtml = member[3] || "";
  const stateMatch = stateHtml.match(/title="([^"]+)"/);
  const state = stateMatch ? stateMatch[1] : "Unknown State";

  // Extract last name from index 4: "Auer"
  const lastName = member[4] || "";

  // Extract profile URL from index 7: "/person/30688"
  const profilePath = member[7] || member[11];
  const profileUrl = profilePath
    ? `https://www.parlament.gv.at${profilePath}`
    : undefined;

  // Extract detailed info from index 6
  const detailedInfo = member[6] || undefined;

  // Parse name components
  const nameParts = fullName.split(" ");
  let firstName: string | null = null;
  let title: string | null = null;

  if (nameParts.length >= 2) {
    // Handle "Auer Katrin, Mag." format
    const withoutTitle = fullName.replace(/,.*$/, ""); // Remove titles after comma
    const parts = withoutTitle.split(" ");
    firstName = parts[1] || parts[0];

    // Extract title if present
    const titleMatch = fullName.match(/, ([^,]+)$/);
    title = titleMatch ? titleMatch[1] : null;
  }

  return {
    fullName,
    firstName,
    lastName,
    title,
    party,
    electoralDistrict,
    state,
    profileUrl,
    detailedInfo,
  };
}

/**
 * Gets the short code for a state name
 */
export function getStateShortCode(stateName: string): string {
  // Reverse lookup from state names to short codes
  for (const [code, name] of Object.entries(STATE_NAMES)) {
    if (name === stateName) {
      return code;
    }
  }
  return stateName.substring(0, 2).toUpperCase();
}

/**
 * Extracts district code from full district name
 */
export function extractDistrictCode(district: string): string {
  const match = district.match(/^(\d+[A-Z])/);
  return match ? match[1] : district;
}

/**
 * Extracts district name from full district name
 */
export function extractDistrictName(districtFullName: string): string {
  // Extract name like "Traunviertel" from "4D Traunviertel"
  const match = districtFullName.match(/^[A-Z0-9]+\s+(.+)$/);
  return match ? match[1] : districtFullName;
}

/**
 * Creates party data with color mapping
 */
export function createPartyData(partyName: string): PartyData {
  return {
    name: partyName,
    shortName: partyName,
    color: PARTY_COLORS[partyName] || "#6C757D",
  };
}

/**
 * Creates state data with short code
 */
export function createStateData(stateName: string): StateData {
  return {
    name: stateName,
    shortCode: getStateShortCode(stateName),
  };
}

/**
 * Creates electoral district data
 */
export function createDistrictData(districtFullName: string): DistrictData {
  return {
    code: extractDistrictCode(districtFullName),
    name: extractDistrictName(districtFullName),
    fullName: districtFullName,
  };
}

/**
 * Processes member data and collects unique entities
 */
export function processParliamentData(rows: string[][]): {
  uniqueParties: Map<string, PartyData>;
  uniqueStates: Map<string, StateData>;
  uniqueDistricts: Map<string, DistrictData>;
  memberData: ParsedMemberData[];
} {
  const uniqueParties = new Map<string, PartyData>();
  const uniqueStates = new Map<string, StateData>();
  const uniqueDistricts = new Map<string, DistrictData>();
  const memberData: ParsedMemberData[] = [];

  for (const row of rows) {
    const [
      fullName,
      partyHtml,
      electoralDistrict,
      stateHtml,
      lastName,
      _unknown1,
      detailedInfo,
      profileUrl,
    ] = row;

    // Extract party info
    const partyMatch = partyHtml.match(/>([^<]+)</);
    const party = partyMatch ? partyMatch[1] : "Independent";

    // Extract state info
    const stateMatch = stateHtml.match(/title="([^"]+)"/);
    const state = stateMatch ? stateMatch[1] : "Unknown";
    const stateCodeMatch = stateHtml.match(/>([^<]+)</);
    const stateCode = stateCodeMatch ? stateCodeMatch[1] : "?";

    // Extract first name from full name
    const nameParts = fullName.split(" ");
    const firstName = nameParts.length >= 2 ? nameParts[1] : "";
    const title = fullName.includes(",") ? fullName.split(",")[1].trim() : null;

    // Get member ID and profile image URL
    const memberId = extractMemberId(profileUrl);
    const profileImageUrl = memberId; // TODO: get profile image url

    // Add to unique collections
    if (!uniqueParties.has(party)) {
      uniqueParties.set(party, {
        name: party,
        shortName: party,
        color: null, // You might want to add a color mapping
      });
    }

    if (!uniqueStates.has(state)) {
      uniqueStates.set(state, {
        name: state,
        shortCode: stateCode,
      });
    }

    const districtCode = extractDistrictCode(electoralDistrict);
    if (!uniqueDistricts.has(districtCode)) {
      uniqueDistricts.set(districtCode, {
        code: districtCode,
        name: electoralDistrict.replace(districtCode, "").trim(),
        fullName: electoralDistrict,
      });
    }

    // Add member data
    memberData.push({
      id: memberId,
      fullName,
      firstName,
      lastName,
      title,
      profileUrl,
      profileImageUrl,
      detailedInfo,
      party,
      state,
      electoralDistrict: districtCode,
    });
  }

  return {
    uniqueParties,
    uniqueStates,
    uniqueDistricts,
    memberData,
  };
}

/**
 * Safely extracts an array from a possibly null/undefined value
 */
function safeArray<T>(value: T[] | null | undefined): T[] {
  if (!value) return [];
  return value;
}

/**
 * Parses detailed member data from the API response
 */
export function parseDetailedMemberData(data: DetailedMemberResponse) {
  const { birthDate, birthPlace } = extractBirthPlace(data);

  return {
    birthDate,
    birthPlace,
  };
}

export function extractMemberId(profileUrl: string): string {
  const match = profileUrl.match(/\/person\/(\d+)/);
  if (!match) throw new Error(`Invalid profile URL: ${profileUrl}`);
  return match[1];
}

function extractBirthDate(gebtext: string): string | null {
  const match = gebtext.match(/Geb\.: (\d{2}\.\d{2}\.\d{4}), (.+)/);
  if (!match) return null;
  return match[1];
}

function extractBirthPlace(data: DetailedMemberResponse) {
  const gebtext = data.content.biografie.kurzbiografie.gebtext;

  // Extract birth date and place from either:
  // "Geb.: 13.08.1980, Voitsberg (Steiermark)" or
  // "Geb.: 1974, Lilienfeld (Niederösterreich)"
  let birthDate: string | null = null;
  let birthPlace: string | null = null;

  if (gebtext) {
    const fullDateMatch = gebtext.match(/Geb\.: (\d{2}\.\d{2}\.\d{4}), (.+)/);
    if (fullDateMatch) {
      birthDate = fullDateMatch[1];
      birthPlace = fullDateMatch[2];
    } else {
      // Try year-only format (YYYY)
      const yearMatch = gebtext.match(/Geb\.: (\d{4}), (.+)/);
      if (yearMatch) {
        birthDate = yearMatch[1];
        birthPlace = yearMatch[2];
      } else {
        console.log("!! No birth date found for member");
      }
    }
  } else {
    console.log("!! No gebtext found for member");
  }

  return { birthPlace, birthDate };
}

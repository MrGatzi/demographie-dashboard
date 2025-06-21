import { PARTY_COLORS, STATE_NAMES } from './constants';
import { ParsedMemberData, PartyData, StateData, DistrictData } from './types';

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
  const profileUrl = profilePath ? `https://www.parlament.gv.at${profilePath}` : undefined;
  
  // Extract detailed info from index 6
  const detailedInfo = member[6] || undefined;
  
  // Parse name components
  const nameParts = fullName.split(" ");
  let firstName: string | undefined;
  let title: string | undefined;
  
  if (nameParts.length >= 2) {
    // Handle "Auer Katrin, Mag." format
    const withoutTitle = fullName.replace(/,.*$/, ""); // Remove titles after comma
    const parts = withoutTitle.split(" ");
    firstName = parts[1] || parts[0];
    
    // Extract title if present
    const titleMatch = fullName.match(/, ([^,]+)$/);
    title = titleMatch ? titleMatch[1] : undefined;
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
export function extractDistrictCode(districtFullName: string): string {
  // Extract code like "4D" from "4D Traunviertel"
  const match = districtFullName.match(/^([A-Z0-9]+)/);
  return match ? match[1] : districtFullName.substring(0, 2);
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
    color: PARTY_COLORS[partyName] || '#6C757D',
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
export function processParliamentData(rows: string[][]) {
  const uniqueParties = new Map<string, PartyData>();
  const uniqueStates = new Map<string, StateData>();
  const uniqueDistricts = new Map<string, DistrictData>();
  const memberData: ParsedMemberData[] = [];

  for (const memberRow of rows) {
    const parsedData = parseMemberData(memberRow);
    
    // Collect unique parties
    if (!uniqueParties.has(parsedData.party)) {
      uniqueParties.set(parsedData.party, createPartyData(parsedData.party));
    }

    // Collect unique states
    if (!uniqueStates.has(parsedData.state)) {
      uniqueStates.set(parsedData.state, createStateData(parsedData.state));
    }

    // Collect unique electoral districts
    const districtCode = extractDistrictCode(parsedData.electoralDistrict);
    if (!uniqueDistricts.has(districtCode)) {
      uniqueDistricts.set(districtCode, createDistrictData(parsedData.electoralDistrict));
    }

    memberData.push(parsedData);
  }

  return {
    uniqueParties,
    uniqueStates,
    uniqueDistricts,
    memberData,
  };
} 
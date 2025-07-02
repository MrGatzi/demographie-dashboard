export interface ParliamentResponse {
  count: number;
  pages: number;
  rows: string[][];
}

export interface DetailedMemberResponse {
  pagetype: string;
  content: {
    biografie: {
      kurzbiografie: {
        gebtext: string;
        beruflicheTaetigkeit: string;
        beruflicherWerdegang: string[];
        bildungsweg: string[];
        politischeFunktionen: string[];
      };
    };
    banner: {
      socialMedia: Array<{
        url: string;
        name: string;
        type: string;
      }>;
    };
    ausschuss?: {
      filter?: {
        data?: {
          definition?: {
            bez?: string;
          };
        };
      };
    };
  };
}

export interface PartyData {
  name: string;
  shortName: string;
  color: string | null;
}

export interface StateData {
  name: string;
  shortCode: string;
}

export interface DistrictData {
  code: string;
  name: string;
  fullName: string;
}

export interface ParsedMemberData {
  id: string;
  fullName: string;
  firstName: string | null;
  lastName: string;
  title: string | null;
  profileUrl: string;
  profileImageUrl: string;
  detailedInfo: string | null;
  party: string;
  state: string;
  electoralDistrict: string;
}

export interface ParsedDetailedMemberData {
  birthDate: string | null; // Format: DD.MM.YYYY
  birthPlace: string | null;
  occupation: string | null;
  careerHistory: string[] | null;
  education: string[] | null;
  politicalFunctions: string[] | null;
  committees: string | null;
  socialMedia: Array<{
    url: string;
    name: string;
    type: string;
  }> | null;
}

export function parseDetailedMemberData(
  data: DetailedMemberResponse
): ParsedDetailedMemberData {
  // Extract birth date from "Geb.: 28.04.1968, Wien" format
  const birthInfo = data.content?.biografie?.kurzbiografie?.gebtext?.match(
    /Geb\.: (\d{2}\.\d{2}\.\d{4})/
  );
  const birthDate = birthInfo ? birthInfo[1] : null;

  // Extract birth place (everything after the comma and space in gebtext)
  const birthPlace =
    data.content?.biografie?.kurzbiografie?.gebtext?.split(", ")[1] || null;

  return {
    birthDate,
    birthPlace,
    occupation:
      data.content?.biografie?.kurzbiografie?.beruflicheTaetigkeit || null,
    careerHistory:
      data.content?.biografie?.kurzbiografie?.beruflicherWerdegang || null,
    education: data.content?.biografie?.kurzbiografie?.bildungsweg || null,
    politicalFunctions:
      data.content?.biografie?.kurzbiografie?.politischeFunktionen || null,
    committees: null, // TODO: Extract from data once we know where it is
    socialMedia: data.content?.banner?.socialMedia || null,
  };
}

export interface ParliamentMemberData {
  id: string;
  fullName: string;
  firstName: string | null;
  lastName: string;
  title: string | null;
  profileUrl: string;
  profileImageUrl: string;
  detailedInfo: string | null;
  partyId: number;
  stateId: number;
  electoralDistrictId: number;
  fetchedAt: Date;
  isActive?: boolean;
}

export interface MemberWithId {
  id: string;
}

export interface ImportSessionData {
  sessionId: string;
  totalRecords: number;
  importedRecords: number;
  status: "processing" | "completed" | "failed";
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}

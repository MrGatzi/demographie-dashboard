export interface ParliamentResponse {
  pages: number;
  count: number;
  header: Array<{
    label: string;
    hidden: boolean;
    sortable: boolean;
  }>;
  rows: string[][];
}

export interface ParsedMemberData {
  fullName: string;
  firstName?: string;
  lastName: string;
  title?: string;
  party: string;
  electoralDistrict: string;
  state: string;
  profileUrl?: string;
  detailedInfo?: string;
}

export interface PartyData {
  name: string;
  shortName: string;
  color: string;
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

export interface ParliamentMemberData {
  fullName: string;
  firstName?: string;
  lastName: string;
  title?: string;
  profileUrl?: string;
  detailedInfo?: string;
  partyId: number;
  stateId: number;
  electoralDistrictId: number;
  fetchedAt: Date;
  isActive: boolean;
}

export interface ImportSessionData {
  sessionId: string;
  totalRecords: number;
  importedRecords: number;
  status: 'processing' | 'completed' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  error?: string;
} 
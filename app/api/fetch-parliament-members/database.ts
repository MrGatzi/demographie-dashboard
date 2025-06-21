import { PrismaClient } from '../../generated/prisma';
import { PartyData, StateData, DistrictData, ParliamentMemberData, ParsedMemberData } from './types';
import { extractDistrictCode } from './utils';

// Singleton Prisma client to avoid connection issues
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Database service class for parliament data operations
 */
export class ParliamentDatabaseService {
  /**
   * Wipes all existing parliament data
   */
  static async wipeExistingData(): Promise<void> {
    console.log('Wiping existing data...');
    // Delete in proper order to respect foreign key constraints
    await prisma.parliamentMember.deleteMany({});
    await prisma.party.deleteMany({});
    await prisma.state.deleteMany({});
    await prisma.electoralDistrict.deleteMany({});
  }

  /**
   * Bulk inserts parties and returns them with IDs
   */
  static async bulkInsertParties(parties: Map<string, PartyData>) {
    console.log('Bulk inserting parties...');
    await prisma.party.createMany({
      data: Array.from(parties.values()),
    });
    return await prisma.party.findMany({
      select: { id: true, shortName: true },
    });
  }

  /**
   * Bulk inserts states and returns them with IDs
   */
  static async bulkInsertStates(states: Map<string, StateData>) {
    console.log('Bulk inserting states...');
    await prisma.state.createMany({
      data: Array.from(states.values()),
    });
    return await prisma.state.findMany({
      select: { id: true, name: true },
    });
  }

  /**
   * Bulk inserts electoral districts and returns them with IDs
   */
  static async bulkInsertDistricts(districts: Map<string, DistrictData>) {
    console.log('Bulk inserting electoral districts...');
    await prisma.electoralDistrict.createMany({
      data: Array.from(districts.values()),
    });
    return await prisma.electoralDistrict.findMany({
      select: { id: true, code: true },
    });
  }

  /**
   * Bulk inserts parliament members
   */
  static async bulkInsertParliamentMembers(memberData: ParliamentMemberData[]) {
    console.log('Bulk inserting parliament members...');
    await prisma.parliamentMember.createMany({
      data: memberData,
    });
  }

  /**
   * Creates lookup maps for foreign key relationships
   */
  static createLookupMaps(
    parties: Array<{ id: number; shortName: string }>,
    states: Array<{ id: number; name: string }>,
    districts: Array<{ id: number; code: string }>
  ) {
    return {
      partyIdMap: new Map(parties.map(p => [p.shortName, p.id])),
      stateIdMap: new Map(states.map(s => [s.name, s.id])),
      districtIdMap: new Map(districts.map(d => [d.code, d.id])),
    };
  }

  /**
   * Prepares parliament member data with foreign keys
   */
  static prepareParliamentMembersData(
    memberData: ParsedMemberData[],
    lookupMaps: {
      partyIdMap: Map<string, number>;
      stateIdMap: Map<string, number>;
      districtIdMap: Map<string, number>;
    },
    fetchedAt: Date
  ): ParliamentMemberData[] {
    console.log('Preparing parliament members data...');
    return memberData.map(parsedData => ({
      fullName: parsedData.fullName,
      firstName: parsedData.firstName,
      lastName: parsedData.lastName,
      title: parsedData.title,
      profileUrl: parsedData.profileUrl,
      detailedInfo: parsedData.detailedInfo,
      partyId: lookupMaps.partyIdMap.get(parsedData.party)!,
      stateId: lookupMaps.stateIdMap.get(parsedData.state)!,
      electoralDistrictId: lookupMaps.districtIdMap.get(extractDistrictCode(parsedData.electoralDistrict))!,
      fetchedAt,
      isActive: true,
    }));
  }

  /**
   * Creates a new import session
   */
  static async createImportSession(sessionId: string, startedAt: Date) {
    return await prisma.dataImportSession.create({
      data: {
        sessionId,
        totalRecords: 0,
        importedRecords: 0,
        status: 'processing',
        startedAt,
      },
    });
  }

  /**
   * Updates import session with total records
   */
  static async updateSessionTotalRecords(sessionId: number, totalRecords: number) {
    await prisma.dataImportSession.update({
      where: { id: sessionId },
      data: { totalRecords },
    });
  }

  /**
   * Marks import session as completed
   */
  static async completeImportSession(sessionId: number, importedRecords: number) {
    await prisma.dataImportSession.update({
      where: { id: sessionId },
      data: {
        importedRecords,
        status: 'completed',
        completedAt: new Date(),
      },
    });
  }

  /**
   * Marks import session as failed
   */
  static async failImportSession(sessionId: string, error: string) {
    try {
      await prisma.dataImportSession.update({
        where: { sessionId },
        data: {
          status: 'failed',
          error,
          completedAt: new Date(),
        },
      });
    } catch (updateError) {
      console.error('Failed to update import session:', updateError);
    }
  }
} 
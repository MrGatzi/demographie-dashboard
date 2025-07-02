import { PrismaClient } from "../../generated/prisma";
import {
  DetailedMemberResponse,
  DistrictData,
  ParliamentMemberData,
  ParsedMemberData,
  PartyData,
  StateData,
} from "./types";
import { parseDetailedMemberData } from "./utils";

// Singleton Prisma client to avoid connection issues
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Database service class for parliament data operations
 */
export class ParliamentDatabaseService {
  /**
   * Wipes all existing parliament data
   */
  static async wipeExistingData(): Promise<void> {
    console.log("Wiping existing data...");
    await prisma.parliamentMember.deleteMany();
    await prisma.party.deleteMany();
    await prisma.state.deleteMany();
    await prisma.electoralDistrict.deleteMany();
    await prisma.dataImportSession.deleteMany();
  }

  /**
   * Bulk inserts parties and returns them with IDs
   */
  static async bulkInsertParties(parties: Map<string, PartyData>) {
    console.log("Bulk inserting parties...");
    const partyData = Array.from(parties.values()).map((party) => ({
      name: party.name,
      shortName: party.shortName,
      color: party.color,
    }));

    await prisma.party.createMany({
      data: partyData,
      skipDuplicates: true,
    });

    return prisma.party.findMany();
  }

  /**
   * Bulk inserts states and returns them with IDs
   */
  static async bulkInsertStates(states: Map<string, StateData>) {
    console.log("Bulk inserting states...");
    const stateData = Array.from(states.values()).map((state) => ({
      name: state.name,
      shortCode: state.shortCode,
    }));

    await prisma.state.createMany({
      data: stateData,
      skipDuplicates: true,
    });

    return prisma.state.findMany();
  }

  /**
   * Bulk inserts electoral districts and returns them with IDs
   */
  static async bulkInsertDistricts(districts: Map<string, DistrictData>) {
    console.log("Bulk inserting electoral districts...");
    const districtData = Array.from(districts.values()).map((district) => ({
      code: district.code,
      name: district.name,
      fullName: district.fullName,
    }));

    await prisma.electoralDistrict.createMany({
      data: districtData,
      skipDuplicates: true,
    });

    return prisma.electoralDistrict.findMany();
  }

  /**
   * Bulk inserts parliament members
   */
  static async bulkInsertParliamentMembers(
    membersData: ParliamentMemberData[]
  ) {
    console.log("Bulk inserting parliament members...");
    await prisma.parliamentMember.createMany({
      data: membersData,
      skipDuplicates: true,
    });
  }

  /**
   * Creates lookup maps for foreign key relationships
   */
  static createLookupMaps(
    parties: Array<{ id: number; name: string }>,
    states: Array<{ id: number; name: string }>,
    districts: Array<{ id: number; code: string }>
  ) {
    return {
      partyIds: new Map(parties.map((p) => [p.name, p.id])),
      stateIds: new Map(states.map((s) => [s.name, s.id])),
      districtIds: new Map(districts.map((d) => [d.code, d.id])),
    };
  }

  /**
   * Prepares parliament member data with foreign keys
   */
  static prepareParliamentMembersData(
    memberData: ParsedMemberData[],
    lookupMaps: {
      partyIds: Map<string, number>;
      stateIds: Map<string, number>;
      districtIds: Map<string, number>;
    },
    fetchedAt: Date
  ): ParliamentMemberData[] {
    console.log("Preparing parliament members data...");
    return memberData.map((member) => ({
      id: member.id,
      fullName: member.fullName,
      firstName: member.firstName,
      lastName: member.lastName,
      title: member.title,
      profileUrl: member.profileUrl,
      profileImageUrl: member.profileImageUrl,
      detailedInfo: member.detailedInfo,
      partyId: lookupMaps.partyIds.get(member.party)!,
      stateId: lookupMaps.stateIds.get(member.state)!,
      electoralDistrictId: lookupMaps.districtIds.get(
        member.electoralDistrict
      )!,
      fetchedAt,
      isActive: true,
    }));
  }

  /**
   * Creates a new import session
   */
  static async createImportSession(sessionId: string, startedAt: Date) {
    return prisma.dataImportSession.create({
      data: {
        sessionId,
        totalRecords: 0,
        importedRecords: 0,
        status: "processing",
        startedAt,
      },
    });
  }

  /**
   * Updates import session with total records
   */
  static async updateSessionTotalRecords(
    sessionId: string,
    totalRecords: number
  ) {
    return prisma.dataImportSession.update({
      where: { sessionId },
      data: { totalRecords },
    });
  }

  /**
   * Marks import session as completed
   */
  static async completeImportSession(
    sessionId: string,
    processedRecords: number
  ) {
    return prisma.dataImportSession.update({
      where: { sessionId },
      data: {
        status: "completed",
        importedRecords: processedRecords,
        completedAt: new Date(),
      },
    });
  }

  /**
   * Marks import session as failed
   */
  static async failImportSession(sessionId: string, error: string) {
    return prisma.dataImportSession.update({
      where: { sessionId },
      data: {
        status: "failed",
        error,
        completedAt: new Date(),
      },
    });
  }

  /**
   * Updates a parliament member with detailed data
   */
  static async updateMemberWithDetailedData(
    memberId: string,
    detailedData: DetailedMemberResponse
  ): Promise<void> {
    const parsedData = parseDetailedMemberData(detailedData);
    console.log(parsedData);

    await prisma.parliamentMember.update({
      where: { id: memberId },
      data: {
        birthDate: parsedData.birthDate,
        birthPlace: parsedData.birthPlace,
      },
    });
  }
}

import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { ParliamentApiClient } from "./api-client";
import { ParliamentDatabaseService } from "./database";
import { MemberWithId } from "./types";
import { processParliamentData } from "./utils";

export const runtime = "nodejs";

// Maximum number of concurrent requests
const MAX_CONCURRENT_REQUESTS = 5;

export async function GET(request: NextRequest) {
  const sessionId = uuidv4();
  const startedAt = new Date();

  try {
    console.log(`Starting import session: ${sessionId}`);

    const parliamentData = await ParliamentApiClient.fetchParliamentData();
    await ParliamentDatabaseService.wipeExistingData();

    const importSession = await ParliamentDatabaseService.createImportSession(
      sessionId,
      startedAt
    );

    await ParliamentDatabaseService.updateSessionTotalRecords(
      sessionId,
      parliamentData.count
    );

    const { uniqueParties, uniqueStates, uniqueDistricts, memberData } =
      processParliamentData(parliamentData.rows);

    const [createdParties, createdStates, createdDistricts] = await Promise.all(
      [
        ParliamentDatabaseService.bulkInsertParties(uniqueParties),
        ParliamentDatabaseService.bulkInsertStates(uniqueStates),
        ParliamentDatabaseService.bulkInsertDistricts(uniqueDistricts),
      ]
    );

    const lookupMaps = ParliamentDatabaseService.createLookupMaps(
      createdParties,
      createdStates,
      createdDistricts
    );

    const fetchedAt = new Date();
    const parliamentMembersData =
      ParliamentDatabaseService.prepareParliamentMembersData(
        memberData,
        lookupMaps,
        fetchedAt
      );

    await ParliamentDatabaseService.bulkInsertParliamentMembers(
      parliamentMembersData
    );

    const processedCount = parliamentMembersData.length;
    console.log(`Successfully processed ${processedCount} members`);

    console.log("Starting detailed data fetch in parallel...");
    for (
      let i = 0;
      i < parliamentMembersData.length;
      i += MAX_CONCURRENT_REQUESTS
    ) {
      const chunk = parliamentMembersData.slice(i, i + MAX_CONCURRENT_REQUESTS);
      const promises = chunk.map(async (member: MemberWithId) => {
        try {
          console.log(`Fetching detailed data for member ${member.id}...`);
          const detailedData =
            await ParliamentApiClient.fetchDetailedMemberData(member.id);
          await ParliamentDatabaseService.updateMemberWithDetailedData(
            member.id,
            detailedData
          );
        } catch (error) {
          console.error(
            `Failed to fetch detailed data for member ${member.id}:`,
            error
          );
        }
      });

      await Promise.all(promises);

      if (i + MAX_CONCURRENT_REQUESTS < parliamentMembersData.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    await ParliamentDatabaseService.completeImportSession(
      sessionId,
      processedCount
    );

    return new Response(
      JSON.stringify({
        success: true,
        message:
          "Parliament data fetched and stored successfully using bulk operations",
        data: {
          session_id: sessionId,
          total_members: parliamentData.count,
          processed_members: processedCount,
          detailed_data_fetched: parliamentMembersData.length,
          pages: parliamentData.pages,
          fetched_at: fetchedAt.toISOString(),
          import_session_completed: true,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in fetch-parliament-data:", error);

    await ParliamentDatabaseService.failImportSession(
      sessionId,
      error instanceof Error ? error.message : "Unknown error occurred"
    );

    return new Response(
      JSON.stringify({
        success: false,
        session_id: sessionId,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

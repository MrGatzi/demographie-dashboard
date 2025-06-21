import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import { ParliamentApiClient } from './api-client';
import { ParliamentDatabaseService } from './database';
import { processParliamentData } from './utils';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const sessionId = uuidv4();
  const startedAt = new Date();
  
  try {
  
   
    console.log(`Starting import session: ${sessionId}`);

    // Fetch data from Parliament API
    const parliamentData = await ParliamentApiClient.fetchParliamentData();
    // Wipe existing data for fresh import
    await ParliamentDatabaseService.wipeExistingData();

    // Create import session for tracking
    const importSession = await ParliamentDatabaseService.createImportSession(sessionId, startedAt);
    // Update session with total records count
    await ParliamentDatabaseService.updateSessionTotalRecords(importSession.id, parliamentData.count);

    // Process and organize the data
    const { uniqueParties, uniqueStates, uniqueDistricts, memberData } = processParliamentData(parliamentData.rows);

    // Bulk insert reference data and get IDs
    const [createdParties, createdStates, createdDistricts] = await Promise.all([
      ParliamentDatabaseService.bulkInsertParties(uniqueParties),
      ParliamentDatabaseService.bulkInsertStates(uniqueStates),
      ParliamentDatabaseService.bulkInsertDistricts(uniqueDistricts),
    ]);

    // Create lookup maps for foreign key relationships
    const lookupMaps = ParliamentDatabaseService.createLookupMaps(
      createdParties,
      createdStates,
      createdDistricts
    );

    // Prepare parliament member data with foreign keys
    const fetchedAt = new Date();
    const parliamentMembersData = ParliamentDatabaseService.prepareParliamentMembersData(
      memberData,
      lookupMaps,
      fetchedAt
    );

    // Bulk insert parliament members
    await ParliamentDatabaseService.bulkInsertParliamentMembers(parliamentMembersData);

    const processedCount = parliamentMembersData.length;
    console.log(`Successfully processed ${processedCount} members`);

    // Mark import session as completed
    await ParliamentDatabaseService.completeImportSession(importSession.id, processedCount);

    return new Response(JSON.stringify({
      success: true,
      message: 'Parliament data fetched and stored successfully using bulk operations',
      data: {
        session_id: sessionId,
        total_members: parliamentData.count,
        processed_members: processedCount,
        pages: parliamentData.pages,
        fetched_at: fetchedAt.toISOString(),
        import_session_completed: true,
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error in fetch-parliament-data:', error);
    
    // Mark import session as failed
    await ParliamentDatabaseService.failImportSession(
      sessionId,
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
    
    return new Response(JSON.stringify({
      success: false,
      session_id: sessionId,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 
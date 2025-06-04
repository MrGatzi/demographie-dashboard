import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface ParliamentMember {
  NRBR: string[];
  GP: string[];
  R_WF: string[];
  M: string[];
  W: string[];
}

interface ParliamentResponse {
  // Define the response structure based on what the API returns
  data?: any[];
  success?: boolean;
  message?: string;
}

export async function POST() {
  try {
    console.log("Starting parliament data sync...");

    // Prepare the request body
    const postBody: ParliamentMember = {
      NRBR: ["BR"],
      GP: ["AKT"],
      R_WF: ["WP"],
      M: ["M"],
      W: ["W"],
    };

    // Fetch data from Austrian Parliament API
    const response = await fetch(
      "https://www.parlament.gv.at/Filter/api/json/post?jsMode=EVAL&FBEZ=WFW_005&listeId=undefined&showAll=true&export=true",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Demographics-Dashboard/1.0",
        },
        body: JSON.stringify(postBody),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Parliament API responded with status: ${response.status}`
      );
    }

    const parliamentData: ParliamentResponse = await response.json();
    console.log("Received data from Parliament API");

    // Process and store data in Supabase using Prisma
    if (parliamentData.data && Array.isArray(parliamentData.data)) {
      // Store raw data with timestamp using Prisma
      const insertedRecord = await prisma.parliamentDataRaw.create({
        data: {
          data: parliamentData.data,
          fetchedAt: new Date(),
          recordCount: parliamentData.data.length,
        },
      });

      console.log(
        `Successfully stored ${parliamentData.data.length} records with ID: ${insertedRecord.id}`
      );

      return NextResponse.json({
        success: true,
        message: `Successfully processed ${parliamentData.data.length} records`,
        recordId: insertedRecord.id.toString(),
        timestamp: new Date().toISOString(),
      });
    } else {
      throw new Error("No valid data received from Parliament API");
    }
  } catch (error) {
    console.error("Error in parliament data sync:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  } finally {
    // Disconnect Prisma client
    await prisma.$disconnect();
  }
}

// Allow GET requests for manual testing
export async function GET() {
  try {
    // Get the latest sync record for status
    const latestSync = await prisma.parliamentDataRaw.findFirst({
      orderBy: {
        fetchedAt: "desc",
      },
      select: {
        id: true,
        fetchedAt: true,
        recordCount: true,
      },
    });

    return NextResponse.json({
      message: "Parliament Data Sync API - Use POST to trigger sync",
      endpoint: "/api/sync-parliament-data",
      method: "POST",
      latestSync: latestSync
        ? {
            id: latestSync.id.toString(),
            fetchedAt: latestSync.fetchedAt,
            recordCount: latestSync.recordCount,
          }
        : null,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Parliament Data Sync API - Use POST to trigger sync",
      endpoint: "/api/sync-parliament-data",
      method: "POST",
      error: "Could not fetch latest sync status",
    });
  } finally {
    await prisma.$disconnect();
  }
}

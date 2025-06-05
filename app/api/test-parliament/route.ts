import { NextResponse } from "next/server";

interface ParliamentMember {
  NRBR: string[];
  GP: string[];
  R_WF: string[];
  M: string[];
  W: string[];
}

export async function POST() {
  try {
    console.log("Testing parliament API call...");

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

    const parliamentData = await response.json();
    console.log("✅ Successfully received data from Parliament API");
    console.log("📊 Response keys:", Object.keys(parliamentData));
    console.log("📈 Data structure:", typeof parliamentData);

    // Check if we have data
    if (parliamentData && typeof parliamentData === "object") {
      const dataKeys = Object.keys(parliamentData);
      let dataCount = 0;
      let sampleData = null;

      // Try to find the data array
      if (Array.isArray(parliamentData)) {
        dataCount = parliamentData.length;
        sampleData = parliamentData[0];
      } else if (parliamentData.data && Array.isArray(parliamentData.data)) {
        dataCount = parliamentData.data.length;
        sampleData = parliamentData.data[0];
      } else {
        // Look for any array in the response
        for (const key of dataKeys) {
          if (Array.isArray(parliamentData[key])) {
            dataCount = parliamentData[key].length;
            sampleData = parliamentData[key][0];
            break;
          }
        }
      }

      return NextResponse.json({
        success: true,
        message: `✅ Parliament API is working!`,
        responseStructure: {
          keys: dataKeys,
          hasData: dataCount > 0,
          recordCount: dataCount,
          sampleRecord: sampleData,
        },
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Unexpected response format from Parliament API",
        response: parliamentData,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("❌ Error testing parliament API:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Parliament API Test - Use POST to test the API call",
    endpoint: "/api/test-parliament",
    method: "POST",
  });
}

"use client";

import axios from "axios";
import { useEffect, useState } from "react";

interface ParliamentMember {
  NRBR: string[];
  GP: string[];
  R_WF: string[];
  M: string[];
  W: string[];
}

interface ParliamentResponse {
  pages: number;
  count: number;
  header: Array<{
    label: string;
    hidden: boolean;
    sortable: boolean;
  }>;
  rows: string[][];
}

export default function Home() {
  const [parliamentData, setParliamentData] =
    useState<ParliamentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchParliamentData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Prepare the request body like in your API route
      const postBody: ParliamentMember = {
        NRBR: ["BR"],
        GP: ["AKT"],
        R_WF: ["WP"],
        M: ["M"],
        W: ["W"],
      };

      const response = await axios.post(
        "https://www.parlament.gv.at/Filter/api/json/post?jsMode=EVAL&FBEZ=WFW_005&listeId=undefined&showAll=true&export=true",
        postBody,
        {
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Demographics-Dashboard/1.0",
          },
        }
      );

      setParliamentData(response.data);
    } catch (err) {
      setError("Failed to fetch parliament data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParliamentData();
  }, []);

  // Extract party statistics from the data
  const getPartyStats = () => {
    if (!parliamentData?.rows) return {};

    const partyCount: { [key: string]: number } = {};

    parliamentData.rows.forEach((row) => {
      // Party info is typically in row[3] based on the data structure
      const partyHtml = row[3] || "";

      // Extract party abbreviations (SPÖ, ÖVP, FPÖ, GRÜNE, NEOS, etc.)
      const partyMatch = partyHtml.match(/>([A-ZÜÖÄ-]+)</);
      if (partyMatch) {
        const party = partyMatch[1];
        partyCount[party] = (partyCount[party] || 0) + 1;
      }
    });

    return partyCount;
  };

  const partyStats = getPartyStats();
  const totalMembers = Object.values(partyStats).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Austrian Parliament Dashboard
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Live data from Austrian Parliament API
            </p>
          </div>

          {loading && (
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-blue-600 font-medium">
                  Loading parliament data...
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 rounded-lg p-6 mb-8">
              <p className="text-red-600 font-medium">{error}</p>
              <button
                onClick={fetchParliamentData}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {parliamentData && (
            <>
              <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-3">
                  Parliament Overview
                </h2>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold">
                      {parliamentData.count}
                    </div>
                    <div className="text-green-100">Total Members</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">
                      {Object.keys(partyStats).length}
                    </div>
                    <div className="text-green-100">Political Parties</div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  Party Distribution
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.entries(partyStats)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 8)
                    .map(([party, count]) => {
                      const percentage = ((count / totalMembers) * 100).toFixed(
                        1
                      );
                      const colors = {
                        SPÖ: "bg-red-500",
                        ÖVP: "bg-black",
                        FPÖ: "bg-blue-600",
                        GRÜNE: "bg-green-600",
                        NEOS: "bg-pink-500",
                        CSP: "bg-yellow-600",
                        SdP: "bg-red-400",
                        GdP: "bg-gray-600",
                      };
                      const bgColor =
                        colors[party as keyof typeof colors] || "bg-gray-400";

                      return (
                        <div key={party} className="bg-gray-50 rounded-lg p-4">
                          <div
                            className={`w-8 h-8 ${bgColor} rounded-full mx-auto mb-2`}
                          ></div>
                          <div className="font-semibold text-gray-900">
                            {party}
                          </div>
                          <div className="text-2xl font-bold text-gray-700">
                            {count}
                          </div>
                          <div className="text-sm text-gray-500">
                            {percentage}%
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">
                  Data Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Pages:</span>{" "}
                    {parliamentData.pages}
                  </div>
                  <div>
                    <span className="font-medium">Data Fields:</span>{" "}
                    {parliamentData.header.length}
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span>{" "}
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="mt-8">
            <button
              onClick={fetchParliamentData}
              disabled={loading}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

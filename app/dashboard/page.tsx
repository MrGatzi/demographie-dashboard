"use client";

import { useState } from "react";
import { ErrorState } from "../components/Error";
import {
  ApiDebugInfo,
  CompactPageHeader,
  MembersGrid,
} from "../components/HomePage";
import { LoadingState } from "../components/Loading";
import { Sidebar } from "../components/Navigation";
import ParliamentFilters from "../components/ParliamentFilters";
import ParliamentStatsCard from "../components/ParliamentStatsCard";
import { useParliamentData } from "../hooks/useParliamentData";

export default function Dashboard() {
  const { parliamentData, loading, error, refetch } = useParliamentData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParty, setSelectedParty] = useState("all");

  // Extract party statistics from the data
  const getPartyStats = () => {
    if (!parliamentData?.rows) return {};

    const partyCount: { [key: string]: number } = {};

    parliamentData.rows.forEach((row) => {
      // Party info is at index 1: "<span title=\"...\">SPÖ</span>"
      const partyHtml = row[1] || "";
      const partyMatch = partyHtml.match(/>([^<]+)</);
      if (partyMatch) {
        const party = partyMatch[1];
        partyCount[party] = (partyCount[party] || 0) + 1;
      }
    });

    return partyCount;
  };

  // Filter members based on search and party selection
  const getFilteredMembers = () => {
    if (!parliamentData?.rows) return [];

    return parliamentData.rows.filter((member) => {
      // Search filter - search in name (index 0), electoral district (index 2), and state
      if (searchTerm) {
        const name = member[0] || "";
        const electoralDistrict = member[2] || "";
        const stateHtml = member[3] || "";
        const stateMatch = stateHtml.match(/title="([^"]+)"/);
        const state = stateMatch ? stateMatch[1] : "";

        const searchableText =
          `${name} ${electoralDistrict} ${state}`.toLowerCase();
        if (!searchableText.includes(searchTerm.toLowerCase())) {
          return false;
        }
      }

      // Party filter
      if (selectedParty !== "all") {
        const partyHtml = member[1] || "";
        const partyMatch = partyHtml.match(/>([^<]+)</);
        const party = partyMatch ? partyMatch[1] : "";
        if (party !== selectedParty) {
          return false;
        }
      }

      return true;
    });
  };

  const partyStats = getPartyStats();
  const filteredMembers = getFilteredMembers();

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedParty("all");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
      <Sidebar />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <CompactPageHeader onRefetch={refetch} isLoading={loading} />

        {loading && (
          <LoadingState message="Fetching current Austrian Parliament members..." />
        )}

        {error && (
          <ErrorState message={error} onRetry={refetch} isLoading={loading} />
        )}

        {parliamentData && !loading && (
          <div className="space-y-8">
            <ParliamentStatsCard
              totalRecords={parliamentData.rows.length}
              totalAvailable={parliamentData.count}
              partyStats={partyStats}
            />

            <ParliamentFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedParty={selectedParty}
              setSelectedParty={setSelectedParty}
              partyStats={partyStats}
              totalMembers={parliamentData.rows.length}
              filteredCount={filteredMembers.length}
            />

            <MembersGrid
              filteredMembers={filteredMembers}
              parliamentHeaders={parliamentData.header}
              onClearFilters={clearAllFilters}
            />

            <ApiDebugInfo parliamentData={parliamentData} />
          </div>
        )}
      </div>
    </div>
  );
}

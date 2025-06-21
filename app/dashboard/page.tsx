"use client";

import { useState } from "react";
import { ErrorState } from "../../components/Error";
import {
  ApiDebugInfo,
  CompactPageHeader,
  MembersGrid,
} from "../../components/HomePage";
import { LoadingState } from "../../components/Loading";
import { Sidebar } from "../../components/Navigation";
import ParliamentFilters from "../../components/ParliamentFilters";
import ParliamentStatsCard from "../../components/ParliamentStatsCard";
import { useParliamentData } from "../hooks/useParliamentData";

export default function Dashboard() {
  const { members, loading, error, refetch } = useParliamentData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParty, setSelectedParty] = useState("all");

  // Extract party statistics from the structured data
  const getPartyStats = () => {
    if (!members) return {};

    const partyCount: { [key: string]: number } = {};

    members.forEach((member) => {
      const partyName = member.party.short_name;
      partyCount[partyName] = (partyCount[partyName] || 0) + 1;
    });

    return partyCount;
  };

  // Filter members based on search and party selection
  const getFilteredMembers = () => {
    if (!members) return [];

    return members.filter((member) => {
      // Search filter - search in name, electoral district, and state
      if (searchTerm) {
        const searchableText = `${member.full_name} ${member.electoral_district.name} ${member.state.name}`.toLowerCase();
        if (!searchableText.includes(searchTerm.toLowerCase())) {
          return false;
        }
      }

      // Party filter
      if (selectedParty !== "all") {
        if (member.party.short_name !== selectedParty) {
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

        {members && !loading && (
          <div className="space-y-8">
            <ParliamentStatsCard
              totalRecords={members.length}
              totalAvailable={members.length}
              partyStats={partyStats}
            />

            <ParliamentFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedParty={selectedParty}
              setSelectedParty={setSelectedParty}
              partyStats={partyStats}
              totalMembers={members.length}
              filteredCount={filteredMembers.length}
            />

            <MembersGrid
              filteredMembers={filteredMembers}
              onClearFilters={clearAllFilters}
            />

            <ApiDebugInfo members={members} />
          </div>
        )}
      </div>
    </div>
  );
}

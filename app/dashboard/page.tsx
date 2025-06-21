"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/Error";
import {
  ApiDebugInfo,
  CompactPageHeader,
  MembersGrid,
} from "@/components/HomePage";
import { LoadingState } from "@/components/Loading";
import { Sidebar } from "@/components/Navigation";
import ParliamentFilters from "@/components/ParliamentFilters";
import ParliamentStatsCard from "@/components/ParliamentStatsCard";
import { useParliamentData } from "../hooks/useParliamentData";
import { useParliamentStore } from "../stores/parliamentStore";

export default function Dashboard() {
  const { members, loading, error, refetch } = useParliamentData();
  
  // Zustand store
  const {
    searchTerm,
    selectedParty,
    filteredMembers,
    partyStats,
    setAllMembers,
    setSearchTerm,
    setSelectedParty,
    clearAllFilters,
  } = useParliamentStore();

  // Update store when data changes
  useEffect(() => {
    if (members) {
      setAllMembers(members);
    }
  }, [members, setAllMembers]);

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

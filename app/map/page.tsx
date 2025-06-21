"use client";

import { ErrorState } from "@/components/Error";
import { LoadingState } from "@/components/Loading";
import { Sidebar } from "@/components/Navigation";
import { useParliamentData } from "../hooks/useParliamentData";
import { MapHeader, SimpleMap } from "@/components/Map";
import { useState } from "react";
import { MembersGrid } from "@/components/HomePage";

export default function MapPage() {
  const { members, loading, error, refetch } = useParliamentData();
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);


  const filteredMembers = members.filter(member => member.electoral_district.code === selectedDistrict);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
      <Sidebar />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <MapHeader onRefetch={refetch} isLoading={loading} />

        {loading && (
          <LoadingState message="Loading electoral district data..." />
        )}

        {error && (
          <ErrorState message={error} onRetry={refetch} isLoading={loading} />
        )}

        {members && !loading && (
          <div className="space-y-6">
            <SimpleMap selectedDistrict={selectedDistrict} setSelectedDistrict={setSelectedDistrict} />
            
            <MembersGrid
              filteredMembers={filteredMembers}
            />
          </div>
        )}
      </div>
    </div>
  );
} 
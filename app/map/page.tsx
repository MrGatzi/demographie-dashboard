"use client";

import { ErrorState } from "@/components/Error";
import { MembersGrid } from "@/components/HomePage";
import { MapHeader } from "@/components/Map";
import { Sidebar } from "@/components/Navigation";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useParliamentData } from "../hooks/useParliamentData";

// Dynamically import SimpleMap with SSR disabled
const SimpleMap = dynamic(
  () => import("@/components/Map/SimpleMap").then((mod) => mod.SimpleMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[50vh] sm:h-116 bg-transparent animate-pulse rounded-lg" />
    ),
  }
);

export default function MapPage() {
  const { members, loading, error, refetch } = useParliamentData();
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const filteredMembers = members.filter(
    (member) => member.electoral_district.code === selectedDistrict
  );
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
      <Sidebar />

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-7xl">
        <MapHeader onRefetch={refetch} isLoading={loading} />

        {error && (
          <ErrorState message={error} onRetry={refetch} isLoading={loading} />
        )}

        {members && !loading && (
          <div className="space-y-4 sm:space-y-6 pt-2 sm:pt-4">
            <SimpleMap
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={setSelectedDistrict}
            />

            <MembersGrid filteredMembers={filteredMembers} />
          </div>
        )}
      </div>
    </div>
  );
}

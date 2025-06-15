"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Database,
  ExternalLink,
  Info,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";
import { useState } from "react";
import { ErrorState } from "./components/Error";
import { LoadingState } from "./components/Loading";
import ParliamentFilters from "./components/ParliamentFilters";
import ParliamentMemberCard from "./components/ParliamentMemberCard";
import ParliamentStatsCard from "./components/ParliamentStatsCard";
import { useParliamentData } from "./hooks/useParliamentData";

export default function Home() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="text-center space-y-6 mb-12">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Badge variant="secondary" className="text-xs px-2 py-1">
                    AT
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Austrian Parliament
              </h1>
              <h2 className="text-xl md:text-2xl font-semibold text-muted-foreground">
                Demographics Dashboard
              </h2>
            </div>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore current members of the Austrian National Council with
              detailed demographics, party affiliations, and interactive
              filtering capabilities.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={refetch}
              disabled={loading}
              size="lg"
              className="min-w-[160px]"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Data
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() =>
                window.open(
                  "https://www.parlament.gv.at/recherchieren/open-data/",
                  "_blank"
                )
              }
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              API Documentation
            </Button>
          </div>

          <div className="flex justify-center">
            <Badge
              variant="outline"
              className="flex items-center space-x-2 px-4 py-2"
            >
              <Info className="w-3 h-3" />
              <span>Data sourced from Austrian Parliament Open Data API</span>
            </Badge>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <LoadingState message="Fetching current Austrian Parliament members..." />
        )}

        {/* Error State */}
        {error && (
          <ErrorState message={error} onRetry={refetch} isLoading={loading} />
        )}

        {/* Data Display */}
        {parliamentData && !loading && (
          <div className="space-y-8">
            {/* Stats Overview */}
            <ParliamentStatsCard
              totalRecords={parliamentData.rows.length}
              totalAvailable={parliamentData.count}
              partyStats={partyStats}
            />

            {/* Search and Filter */}
            <ParliamentFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedParty={selectedParty}
              setSelectedParty={setSelectedParty}
              partyStats={partyStats}
              totalMembers={parliamentData.rows.length}
              filteredCount={filteredMembers.length}
            />

            {/* Members Grid */}
            {filteredMembers.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold flex items-center space-x-2">
                    <Users className="h-6 w-6" />
                    <span>Parliament Members</span>
                  </h3>
                  <Badge
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    <span>{filteredMembers.length} members</span>
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMembers.map((member, index) => (
                    <ParliamentMemberCard
                      key={`${member[0]}-${index}`}
                      member={member}
                      headers={parliamentData.header}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            ) : (
              /* No Results State */
              <Card>
                <CardContent className="text-center py-12">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">
                        No members found
                      </h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search terms or party filter to find
                        members.
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedParty("all");
                      }}
                      variant="outline"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* API Debug Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>API Response Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="text-muted-foreground">
                      Records Retrieved
                    </div>
                    <div className="font-semibold">
                      {parliamentData.rows.length}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Total Available</div>
                    <div className="font-semibold">{parliamentData.count}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Pages Available</div>
                    <div className="font-semibold">{parliamentData.pages}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Data Fields</div>
                    <div className="font-semibold">
                      {parliamentData.header.length}
                    </div>
                  </div>
                </div>

                {/* Data Quality Indicator */}
                <div className="mt-4 pt-4 border-t">
                  {parliamentData.rows.length >= 150 &&
                  parliamentData.rows.length <= 200 ? (
                    <Alert>
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertDescription>
                        ✅ Successfully retrieved current National Council
                        members (~183 expected)
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        📊 Retrieved {parliamentData.rows.length} records
                        {parliamentData.rows.length > 500
                          ? " - This appears to be historical data including all members since 1918"
                          : " - This may be a partial dataset"}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Sample Data Structure */}
                {parliamentData.rows.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-semibold mb-2">
                      Sample Member Data Structure:
                    </h4>
                    <div className="text-xs font-mono bg-muted p-3 rounded overflow-x-auto">
                      <div>
                        <strong>[0]:</strong> {parliamentData.rows[0][0]} (Name)
                      </div>
                      <div>
                        <strong>[1]:</strong>{" "}
                        {parliamentData.rows[0][1]?.substring(0, 50)}... (Party
                        HTML)
                      </div>
                      <div>
                        <strong>[2]:</strong> {parliamentData.rows[0][2]}{" "}
                        (Electoral District)
                      </div>
                      <div>
                        <strong>[3]:</strong> {parliamentData.rows[0][3]} (State
                        HTML)
                      </div>
                      <div>
                        <strong>[4]:</strong> {parliamentData.rows[0][4]} (Last
                        Name)
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

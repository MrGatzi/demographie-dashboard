import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, SlidersHorizontal } from "lucide-react";
import ActiveFilters from "./ActiveFilters";
import PartySelect from "./PartySelect";
import SearchInput from "./SearchInput";

interface ParliamentFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedParty: string;
  setSelectedParty: (party: string) => void;
  partyStats: { [key: string]: number };
  totalMembers: number;
  filteredCount: number;
}

export default function ParliamentFilters({
  searchTerm,
  setSearchTerm,
  selectedParty,
  setSelectedParty,
  partyStats,
  totalMembers,
  filteredCount,
}: ParliamentFiltersProps) {
  const hasActiveFilters = Boolean(searchTerm || selectedParty !== "all");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <SlidersHorizontal className="h-5 w-5" />
          <span>Search & Filter</span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-auto">
              {filteredCount} of {totalMembers}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search Input */}
        <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Party Filter */}
        <PartySelect
          selectedParty={selectedParty}
          setSelectedParty={setSelectedParty}
          partyStats={partyStats}
          totalMembers={totalMembers}
        />

        {/* Active Filters Display */}
        <ActiveFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedParty={selectedParty}
          setSelectedParty={setSelectedParty}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>
              Showing {filteredCount} of {totalMembers} members
            </span>
          </div>

          {hasActiveFilters && (
            <div className="text-xs">
              {Math.round((filteredCount / totalMembers) * 100)}% of total
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  Filter,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";

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
  const uniqueParties = Object.keys(partyStats).sort();
  const hasActiveFilters = searchTerm || selectedParty !== "all";

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedParty("all");
  };

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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, party, or state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm("")}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Party Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filter by Party</span>
            </label>
            {selectedParty !== "all" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedParty("all")}
                className="text-xs"
              >
                Clear
              </Button>
            )}
          </div>

          <Select value={selectedParty} onValueChange={setSelectedParty}>
            <SelectTrigger>
              <SelectValue placeholder="Select a party" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>All Parties ({totalMembers})</span>
                </div>
              </SelectItem>
              {uniqueParties.map((party) => (
                <SelectItem key={party} value={party}>
                  <div className="flex items-center justify-between w-full">
                    <span>{party}</span>
                    <Badge variant="outline" className="ml-2">
                      {partyStats[party]}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Filters:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <Badge
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <Search className="h-3 w-3" />
                  <span>"{searchTerm}"</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchTerm("")}
                    className="h-4 w-4 p-0 ml-1"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {selectedParty !== "all" && (
                <Badge
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <Filter className="h-3 w-3" />
                  <span>{selectedParty}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedParty("all")}
                    className="h-4 w-4 p-0 ml-1"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          </div>
        )}

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

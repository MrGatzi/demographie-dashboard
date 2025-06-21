import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, Search, X } from "lucide-react";

interface ActiveFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedParty: string;
  setSelectedParty: (party: string) => void;
  hasActiveFilters: boolean;
}

export default function ActiveFilters({
  searchTerm,
  setSearchTerm,
  selectedParty,
  setSelectedParty,
  hasActiveFilters,
}: ActiveFiltersProps) {
  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedParty("all");
  };

  if (!hasActiveFilters) return null;

  return (
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
          <Badge variant="secondary" className="flex items-center space-x-1">
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
          <Badge variant="secondary" className="flex items-center space-x-1">
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
  );
}

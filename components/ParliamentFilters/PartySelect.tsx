import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Users } from "lucide-react";

interface PartySelectProps {
  selectedParty: string;
  setSelectedParty: (party: string) => void;
  partyStats: { [key: string]: number };
  totalMembers: number;
}

export default function PartySelect({
  selectedParty,
  setSelectedParty,
  partyStats,
  totalMembers,
}: PartySelectProps) {
  const uniqueParties = Object.keys(partyStats).sort();

  return (
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
  );
}

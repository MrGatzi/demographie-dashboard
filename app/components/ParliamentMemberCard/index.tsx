import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MapPin,
  Vote,
} from "lucide-react";
import { useState } from "react";
import MemberHeader from "./MemberHeader";

interface ParliamentMemberCardProps {
  member: string[];
  headers: Array<{
    label: string;
    hidden: boolean;
    sortable: boolean;
  }>;
  index: number;
}

export default function ParliamentMemberCard({
  member,
  headers,
  index,
}: ParliamentMemberCardProps) {
  const [showDebug, setShowDebug] = useState(false);

  // Extract member information based on the actual data structure
  const getName = () => {
    // Full name is at index 0: "Auer Katrin, Mag."
    return member[0] || "Unknown Member";
  };

  const getParty = () => {
    // Party info is at index 1: "<span title=\"...\">SPÖ</span>"
    const partyHtml = member[1] || "";
    const partyMatch = partyHtml.match(/>([^<]+)</);
    return partyMatch ? partyMatch[1] : "Independent";
  };

  const getElectoralDistrict = () => {
    // Electoral district is at index 2: "4D Traunviertel"
    return member[2] || "Unknown District";
  };

  const getState = () => {
    // State info is at index 3: "<span title=\"Oberösterreich\">O</span>"
    const stateHtml = member[3] || "";
    const stateMatch = stateHtml.match(/title="([^"]+)"/);
    return stateMatch ? stateMatch[1] : "Unknown State";
  };

  const getLastName = () => {
    // Last name is at index 4: "Auer"
    return member[4] || "";
  };

  const getProfileUrl = () => {
    // Profile URL is at index 7: "/person/30688"
    const profilePath = member[7] || member[11]; // Also available at index 11
    return profilePath ? `https://www.parlament.gv.at${profilePath}` : null;
  };

  const getDetailedInfo = () => {
    // Detailed info is at index 6 with HTML formatting
    const detailsHtml = member[6] || "";
    return detailsHtml;
  };

  const getFirstName = () => {
    // Extract first name from full name
    const fullName = getName();
    const nameParts = fullName.split(" ");
    if (nameParts.length >= 2) {
      // Handle "Auer Katrin, Mag." format
      const withoutTitle = fullName.replace(/,.*$/, ""); // Remove titles after comma
      const parts = withoutTitle.split(" ");
      return parts[1] || parts[0]; // Second part is usually first name
    }
    return fullName;
  };

  const name = getName();
  const party = getParty();
  const electoralDistrict = getElectoralDistrict();
  const state = getState();
  const profileUrl = getProfileUrl();
  const firstName = getFirstName();

  // Party colors and variants
  const getPartyStyle = (party: string) => {
    const styles: {
      [key: string]: {
        bg: string;
        text: string;
        variant: "default" | "secondary" | "destructive" | "outline";
      };
    } = {
      SPÖ: { bg: "bg-red-500", text: "text-white", variant: "destructive" },
      ÖVP: { bg: "bg-black", text: "text-white", variant: "default" },
      FPÖ: { bg: "bg-blue-600", text: "text-white", variant: "default" },
      GRÜNE: { bg: "bg-green-600", text: "text-white", variant: "default" },
      NEOS: { bg: "bg-pink-500", text: "text-white", variant: "default" },
      CSP: { bg: "bg-yellow-600", text: "text-white", variant: "default" },
      SdP: { bg: "bg-red-400", text: "text-white", variant: "secondary" },
      GdP: { bg: "bg-gray-600", text: "text-white", variant: "secondary" },
    };
    return (
      styles[party] || {
        bg: "bg-gray-400",
        text: "text-white",
        variant: "outline" as const,
      }
    );
  };

  const partyStyle = getPartyStyle(party);

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] w-full max-w-full">
      <CardHeader className="pb-3 w-full max-w-full overflow-hidden">
        <MemberHeader
          name={name}
          party={party}
          index={index}
          partyStyle={partyStyle}
        />
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Electoral District */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Vote className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{electoralDistrict}</span>
          </div>

          {/* State */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{state}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDebug(!showDebug)}
              className="text-xs"
            >
              {showDebug ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  Hide Details
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Show Details
                </>
              )}
            </Button>

            {profileUrl && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => window.open(profileUrl, "_blank")}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Profile
              </Button>
            )}
          </div>

          {/* Debug/Details Section */}
          {showDebug && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <h4 className="text-xs font-semibold mb-2 text-muted-foreground">
                Member Details
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <strong>Full Name:</strong> {name}
                </div>
                <div>
                  <strong>Party:</strong> {party}
                </div>
                <div>
                  <strong>Electoral District:</strong> {electoralDistrict}
                </div>
                <div>
                  <strong>State:</strong> {state}
                </div>
                <div>
                  <strong>Last Name:</strong> {getLastName()}
                </div>
                {profileUrl && (
                  <div>
                    <strong>Profile:</strong>{" "}
                    <a
                      href={profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {profileUrl}
                    </a>
                  </div>
                )}
              </div>

              <h4 className="text-xs font-semibold mb-2 mt-4 text-muted-foreground">
                Raw API Data
              </h4>
              <div className="space-y-1 text-xs font-mono">
                {member.map((cell, cellIndex) => (
                  <div key={cellIndex} className="flex">
                    <span className="text-muted-foreground w-12 flex-shrink-0">
                      [{cellIndex}]:
                    </span>
                    <span className="break-all">
                      {cell === null ? "null" : String(cell).substring(0, 80)}
                      {cell && String(cell).length > 80 && "..."}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

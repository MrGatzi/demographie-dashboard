import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import MemberActions from "./MemberActions";
import MemberDebugDetails from "./MemberDebugDetails";
import MemberHeader from "./MemberHeader";
import MemberInfo from "./MemberInfo";
import { extractMemberData, getPartyStyle } from "./memberUtils";

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

  // Extract all member data using utility function
  const memberData = extractMemberData(member);
  const partyStyle = getPartyStyle(memberData.party);

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] w-full max-w-full">
      <CardHeader className="pb-3 w-full max-w-full overflow-hidden">
        <MemberHeader
          name={memberData.name}
          party={memberData.party}
          index={index}
          partyStyle={partyStyle}
        />
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Member Info */}
          <MemberInfo
            electoralDistrict={memberData.electoralDistrict}
            state={memberData.state}
          />

          {/* Actions */}
          <MemberActions
            showDebug={showDebug}
            setShowDebug={setShowDebug}
            profileUrl={memberData.profileUrl}
          />

          {/* Debug/Details Section */}
          <MemberDebugDetails
            name={memberData.name}
            party={memberData.party}
            electoralDistrict={memberData.electoralDistrict}
            state={memberData.state}
            lastName={memberData.lastName}
            profileUrl={memberData.profileUrl}
            member={member}
            showDebug={showDebug}
          />
        </div>
      </CardContent>
    </Card>
  );
}

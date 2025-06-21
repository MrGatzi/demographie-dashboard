import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import MemberActions from "./MemberActions";
import MemberDebugDetails from "./MemberDebugDetails";
import MemberHeader from "./MemberHeader";
import MemberInfo from "./MemberInfo";
import { getPartyStyle } from "./memberUtils";
import { ParliamentMember } from "@/app/hooks/useParliamentData";

interface ParliamentMemberCardProps {
  member: ParliamentMember;
}

export default function ParliamentMemberCard({
  member,
}: ParliamentMemberCardProps) {
  const [showDebug, setShowDebug] = useState(false);

  const partyStyle = getPartyStyle(member.party.short_name);

  return (
    <Card className="hover:shadow-lg hover:scale-[1.02] w-full max-w-full">
      <CardHeader className="pb-3 w-full max-w-full overflow-hidden">
        <MemberHeader
          name={member.full_name}
          party={member.party.short_name}
          partyStyle={partyStyle}
        />
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Member Info */}
          <MemberInfo
            electoralDistrict={member.electoral_district.full_name}
            state={member.state.name}
          />

          {/* Actions */}
          <MemberActions
            showDebug={showDebug}
            setShowDebug={setShowDebug}
            profileUrl={member.profile_url}
          />

          {/* Debug/Details Section */}
          <MemberDebugDetails
            name={member.full_name}
            party={member.party.short_name}
            electoralDistrict={member.electoral_district.name}
            state={member.state.name}
            lastName={member.last_name}
            profileUrl={member.profile_url}
            member={member}
            showDebug={showDebug}
          />
        </div>
      </CardContent>
    </Card>
  );
}

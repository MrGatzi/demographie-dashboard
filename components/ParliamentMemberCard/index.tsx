import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import { ParliamentMember } from "../../app/generated/prisma";
import MemberActions from "./MemberActions";
import MemberDebugDetails from "./MemberDebugDetails";
import MemberHeader from "./MemberHeader";
import MemberInfo from "./MemberInfo";
import { getPartyStyle } from "./memberUtils";

interface ParliamentMemberCardProps {
  member: ParliamentMember;
}

export default function ParliamentMemberCard({
  member,
}: ParliamentMemberCardProps) {
  const [showDebug, setShowDebug] = useState(false);
  const partyStyle = getPartyStyle(member.party.shortname);

  return (
    <Link href={`/member/${member.id}`}>
      <Card className="hover:shadow-lg hover:scale-[1.02] w-full max-w-full transition-all duration-200">
        <CardHeader className="pb-3 w-full max-w-full overflow-hidden">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={`https://www.parlament.gv.at/download/l/${member.profileUrl
                  ?.split("/")
                  .pop()}`}
                alt={member.fullName}
              />
              <AvatarFallback>
                {member.firstName?.[0]}
                {member.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <MemberHeader
              name={member.fullName}
              party={member.party.shortName}
              partyStyle={partyStyle}
            />
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Member Info */}
            <MemberInfo
              electoralDistrict={member.electoralDistrict.fullName}
              state={member.state.name}
            />

            {/* Actions */}
            <div onClick={(e) => e.preventDefault()}>
              <MemberActions
                showDebug={showDebug}
                setShowDebug={setShowDebug}
                profileUrl={member.profileUrl}
              />
            </div>

            {/* Debug/Details Section */}
            {showDebug && (
              <div onClick={(e) => e.preventDefault()}>
                <MemberDebugDetails
                  name={member.fullName}
                  party={member.party.shortName}
                  electoralDistrict={member.electoralDistrict.name}
                  state={member.state.name}
                  lastName={member.lastName}
                  profileUrl={member.profileUrl}
                  member={member}
                  showDebug={showDebug}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

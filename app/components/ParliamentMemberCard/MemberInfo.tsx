import { MapPin, Vote } from "lucide-react";

interface MemberInfoProps {
  electoralDistrict: string;
  state: string;
}

export default function MemberInfo({
  electoralDistrict,
  state,
}: MemberInfoProps) {
  return (
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
    </div>
  );
}

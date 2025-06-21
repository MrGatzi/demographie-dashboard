import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MemberHeaderProps {
  name: string;
  party: string;
  partyStyle: {
    bg: string;
    text: string;
  };
}

export default function MemberHeader({
  name,
  party,
  partyStyle,
}: MemberHeaderProps) {
  const getInitials = (name: string) => {
    const cleanName = name.replace(/,.*$/, "");
    return cleanName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-start justify-between gap-3 w-full overflow-hidden">
      <div className="flex items-center space-x-3 flex-1 min-w-0 overflow-hidden">
        <Avatar className="h-12 w-12 flex-shrink-0">
          <AvatarFallback
            className={cn("font-semibold", partyStyle.bg, partyStyle.text)}
          >
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 overflow-hidden">
          <h3 className="font-semibold text-lg leading-tight truncate">
            {name}
          </h3>
          <Badge variant="default" className={cn("mt-1", partyStyle.bg)}>
            <span className={partyStyle.text}>{party}</span>
          </Badge>
        </div>
      </div>
    </div>
  );
}

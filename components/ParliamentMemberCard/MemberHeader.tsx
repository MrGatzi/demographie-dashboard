import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MemberHeaderProps {
  name: string;
  party: string;
  index: number;
  partyStyle: {
    bg: string;
    text: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  };
}

export default function MemberHeader({
  name,
  party,
  index,
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
          <Badge variant={partyStyle.variant} className="mt-1">
            {party}
          </Badge>
        </div>
      </div>
      <div className="text-xs text-muted-foreground font-mono flex-shrink-0 whitespace-nowrap">
        #{index + 1}
      </div>
    </div>
  );
}

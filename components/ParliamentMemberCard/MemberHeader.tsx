import { Badge } from "@/components/ui/badge";

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
    <div className="flex flex-col gap-1">
      <h3 className="font-semibold text-lg leading-none">{name}</h3>
      <Badge className={`${partyStyle.bg} ${partyStyle.text} w-fit`}>
        {party}
      </Badge>
    </div>
  );
}

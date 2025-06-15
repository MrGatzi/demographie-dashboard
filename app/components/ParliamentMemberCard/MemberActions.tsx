import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

interface MemberActionsProps {
  showDebug: boolean;
  setShowDebug: (show: boolean) => void;
  profileUrl: string | null;
}

export default function MemberActions({
  showDebug,
  setShowDebug,
  profileUrl,
}: MemberActionsProps) {
  return (
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
  );
}

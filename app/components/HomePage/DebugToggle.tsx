import { useDebugStore } from "@/app/stores/debugStore";
import { Button } from "@/components/ui/button";
import { Bug, BugOff } from "lucide-react";

export default function DebugToggle() {
  const { isDebugEnabled, toggleDebug } = useDebugStore();

  return (
    <Button
      variant={isDebugEnabled ? "default" : "outline"}
      size="sm"
      onClick={toggleDebug}
      className="fixed bottom-4 right-4 z-50 shadow-lg"
    >
      {isDebugEnabled ? (
        <>
          <BugOff className="w-4 h-4 mr-2" />
          Debug: ON
        </>
      ) : (
        <>
          <Bug className="w-4 h-4 mr-2" />
          Debug: OFF
        </>
      )}
    </Button>
  );
}

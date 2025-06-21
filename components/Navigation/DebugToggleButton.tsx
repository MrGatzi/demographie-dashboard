"use client";

import { useDebugStore } from "@/app/stores/debugStore";
import { cn } from "@/lib/utils";
import { Bug } from "lucide-react";

interface DebugToggleButtonProps {
  isMobile: boolean;
  isExpanded: boolean;
}

export default function DebugToggleButton({
  isMobile,
  isExpanded,
}: DebugToggleButtonProps) {
  const { isDebugEnabled, toggleDebug } = useDebugStore();

  return (
    <button
      onClick={toggleDebug}
      className={cn(
        "w-full flex items-center transition-all duration-200 rounded-md text-sm",
        isMobile ? "h-12" : "h-11",
        !isExpanded && !isMobile ? "justify-center px-0" : "px-3",
        isDebugEnabled
          ? "bg-[--debug-active-bg] text-[--debug-active-text] shadow-lg"
          : "text-[--debug-text] hover:text-[--debug-text-hover] hover:bg-[--debug-bg-hover]"
      )}
    >
      <Bug
        className={cn(
          "w-5 h-5 flex-shrink-0",
          (isExpanded || isMobile) && "mr-3"
        )}
      />
      {(isExpanded || isMobile) && (
        <>
          <span className="truncate">Debug Mode</span>
          {isDebugEnabled && (
            <div className="ml-auto w-2 h-2 rounded-full bg-[--debug-indicator]" />
          )}
        </>
      )}
    </button>
  );
}

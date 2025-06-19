import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface SidebarToggleProps {
  isExpanded: boolean;
  isMobile: boolean;
  onToggle: () => void;
}

export default function SidebarToggle({
  isExpanded,
  isMobile,
  onToggle,
}: SidebarToggleProps) {
  const getIcon = () => {
    if (isMobile) return <X className="w-5 h-5" />;
    return isExpanded ? (
      <ChevronLeft className="w-4 h-4" />
    ) : (
      <ChevronRight className="w-4 h-4" />
    );
  };

  return (
    <button
      onClick={onToggle}
      className={cn(
        "h-9 w-9 p-0 transition-all duration-200 flex-shrink-0 flex items-center justify-center rounded-md text-[--nav-text] hover:text-[--nav-text-hover] hover:bg-[--nav-bg-hover]",
        !isExpanded &&
          !isMobile &&
          "absolute -right-11 bg-[--nav-bg] shadow-md border border-[--nav-border]"
      )}
    >
      {getIcon()}
    </button>
  );
}

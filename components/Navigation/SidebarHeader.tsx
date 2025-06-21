import { cn } from "@/lib/utils";
import { Building2 } from "lucide-react";
import Link from "next/link";

interface SidebarHeaderProps {
  isExpanded: boolean;
  isMobile: boolean;
  onLogoClick?: () => void;
}

export default function SidebarHeader({
  isExpanded,
  isMobile,
  onLogoClick,
}: SidebarHeaderProps) {
  return (
    <Link
      href="/"
      onClick={onLogoClick}
      className={cn(
        "flex items-center gap-3 transition-all duration-200 hover:scale-102",
        !isExpanded && !isMobile && "justify-center"
      )}
    >
      <div className="w-9 h-9 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 flex-shrink-0">
        <Building2 className="w-5 h-5 text-white" />
      </div>
      {(isExpanded || isMobile) && (
        <div className="min-w-0">
          <span className="text-sm font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent truncate block">
            Austrian Parliament
          </span>
        </div>
      )}
    </Link>
  );
}

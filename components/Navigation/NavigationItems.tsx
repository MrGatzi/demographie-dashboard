import { cn } from "@/lib/utils";
import { BarChart3, Building2, Info, Map } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationItemsProps {
  isExpanded: boolean;
  isMobile: boolean;
  onItemClick?: () => void;
}

const navigation = [
  { name: "Home", href: "/", icon: Building2 },
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Map", href: "/map", icon: Map }, 
  { name: "About", href: "/about", icon: Info },
];

export default function NavigationItems({
  isExpanded,
  isMobile,
  onItemClick,
}: NavigationItemsProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-3">
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              "flex items-center transition-all duration-200 rounded-lg text-sm font-medium",
              isMobile ? "h-12" : "h-11",
              !isExpanded && !isMobile ? "justify-center px-0" : "px-3",
              isActive
                ? "text-[--nav-active-text] bg-[--nav-active-bg]"
                : "text-[--nav-text] hover:text-[--nav-text-hover] hover:bg-[--nav-bg-hover]"
            )}
          >
            <Icon
              className={cn(
                "w-5 h-5 flex-shrink-0",
                (isExpanded || isMobile) && "mr-3"
              )}
            />
            {(isExpanded || isMobile) && (
              <>
                <span className="truncate">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-[--nav-active-indicator]" />
                )}
              </>
            )}
          </Link>
        );
      })}
    </div>
  );
}

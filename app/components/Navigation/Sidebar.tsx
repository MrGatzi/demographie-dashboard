"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import DebugToggleButton from "./DebugToggleButton";
import MobileMenuButton from "./MobileMenuButton";
import NavigationItems from "./NavigationItems";
import SidebarHeader from "./SidebarHeader";
import SidebarToggle from "./SidebarToggle";
import ThemeToggleButton from "./ThemeToggleButton";

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsExpanded(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const closeSidebar = () => setIsExpanded(false);
  const toggleSidebar = () => setIsExpanded(!isExpanded);

  return (
    <>
      {isMobile && isExpanded && (
        <div
          className="fixed inset-0 bg-[--mobile-overlay] z-40 backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      <div
        className={cn(
          "fixed left-0 top-0 h-full bg-[--nav-bg] backdrop-blur-lg border-r border-[--nav-border] shadow-2xl z-50 transition-all duration-300 ease-in-out",
          isMobile ? "w-80" : isExpanded ? "w-72" : "w-16",
          isMobile && !isExpanded && "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-[--nav-border]">
            <div className="flex items-center justify-between">
              <SidebarHeader
                isExpanded={isExpanded}
                isMobile={isMobile}
                onLogoClick={isMobile ? closeSidebar : undefined}
              />
              <SidebarToggle
                isExpanded={isExpanded}
                isMobile={isMobile}
                onToggle={toggleSidebar}
              />
            </div>
          </div>

          <div className="flex-1 p-4">
            <NavigationItems
              isExpanded={isExpanded}
              isMobile={isMobile}
              onItemClick={isMobile ? closeSidebar : undefined}
            />
          </div>

          <div className="border-t border-[--nav-border]">
            <div className="p-4 border-b border-[--nav-border]">
              <ThemeToggleButton isMobile={isMobile} isExpanded={isExpanded} />
            </div>
            <div className="p-4">
              <DebugToggleButton isMobile={isMobile} isExpanded={isExpanded} />
            </div>
          </div>
        </div>
      </div>

      <MobileMenuButton
        isVisible={isMobile && !isExpanded}
        onClick={() => setIsExpanded(true)}
      />

      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isMobile ? "ml-0" : isExpanded ? "ml-72" : "ml-16"
        )}
      />
    </>
  );
}

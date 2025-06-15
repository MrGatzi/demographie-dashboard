"use client";

import { useDebugStore } from "@/app/stores/debugStore";
import { useThemeStore } from "@/app/stores/themeStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Bug,
  Building2,
  ChevronLeft,
  ChevronRight,
  Info,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const { isDebugEnabled, toggleDebug } = useDebugStore();
  const { theme, toggleTheme } = useThemeStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // Changed to lg breakpoint
      setIsMobile(mobile);
      // Auto-collapse on mobile
      if (mobile) {
        setIsExpanded(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const navigation = [
    { name: "Home", href: "/", icon: Building2 },
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "About", href: "/about", icon: Info },
  ];

  const closeSidebar = () => setIsExpanded(false);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isExpanded && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-r border-gray-200 dark:border-gray-700 shadow-2xl z-50 transition-all duration-300 ease-in-out",
          // Mobile: full width when expanded, hidden when collapsed
          isMobile
            ? isExpanded
              ? "w-80 translate-x-0"
              : "w-80 -translate-x-full"
            : // Desktop: expandable width
            isExpanded
            ? "w-72"
            : "w-16"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link
                href="/"
                onClick={isMobile ? closeSidebar : undefined}
                className={cn(
                  "flex items-center space-x-3 group transition-all duration-200",
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

              {/* Toggle/Close Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                  "h-9 w-9 p-0 transition-all duration-200 flex-shrink-0 hover:bg-gray-100 dark:hover:bg-gray-800",
                  !isExpanded &&
                    !isMobile &&
                    "absolute -right-3 bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-700"
                )}
              >
                {isMobile ? (
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : isExpanded ? (
                  <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                )}
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4 space-y-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  asChild
                  className={cn(
                    "w-full justify-start text-sm font-medium transition-all duration-200",
                    // Better mobile touch targets
                    isMobile ? "h-12" : "h-11",
                    !isExpanded && !isMobile && "justify-center px-0",
                    isActive
                      ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
                  )}
                >
                  <Link
                    href={item.href}
                    onClick={isMobile ? closeSidebar : undefined}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 flex-shrink-0",
                        (isExpanded || isMobile) && "mr-3"
                      )}
                    />
                    {(isExpanded || isMobile) && (
                      <span className="truncate">{item.name}</span>
                    )}
                    {isActive && (isExpanded || isMobile) && (
                      <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full" />
                    )}
                  </Link>
                </Button>
              );
            })}
          </div>

          {/* Bottom Section - Theme & Debug */}
          <div className="border-t border-gray-200 dark:border-gray-700">
            {/* Theme Toggle */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className={cn(
                  "w-full justify-start transition-all duration-200",
                  // Better mobile touch targets
                  isMobile ? "h-12" : "h-11",
                  !isExpanded && !isMobile && "justify-center px-0",
                  "text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50/50 dark:hover:bg-amber-900/10"
                )}
              >
                {theme === "dark" ? (
                  <Sun
                    className={cn(
                      "w-5 h-5 flex-shrink-0 text-amber-500",
                      (isExpanded || isMobile) && "mr-3"
                    )}
                  />
                ) : (
                  <Moon
                    className={cn(
                      "w-5 h-5 flex-shrink-0 text-slate-600 dark:text-slate-400",
                      (isExpanded || isMobile) && "mr-3"
                    )}
                  />
                )}
                {(isExpanded || isMobile) && (
                  <span className="truncate">
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </span>
                )}
              </Button>
            </div>

            {/* Debug Section */}
            <div className="p-4">
              <Button
                variant={isDebugEnabled ? "default" : "ghost"}
                size="sm"
                onClick={toggleDebug}
                className={cn(
                  "w-full justify-start transition-all duration-200",
                  // Better mobile touch targets
                  isMobile ? "h-12" : "h-11",
                  !isExpanded && !isMobile && "justify-center px-0",
                  isDebugEnabled
                    ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50/50 dark:hover:bg-orange-900/10"
                )}
              >
                <Bug
                  className={cn(
                    "w-5 h-5 flex-shrink-0",
                    (isExpanded || isMobile) && "mr-3"
                  )}
                />
                {(isExpanded || isMobile) && (
                  <span className="truncate">Debug Mode</span>
                )}
                {isDebugEnabled && (isExpanded || isMobile) && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      {isMobile && (
        <Button
          variant="default"
          onClick={() => setIsExpanded(true)}
          className={cn(
            "fixed top-4 left-4 z-40 shadow-lg h-11 w-11 p-0",
            isExpanded && "hidden"
          )}
        >
          <Menu className="w-5 h-5" />
        </Button>
      )}

      {/* Content Spacer */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isMobile ? "ml-0" : isExpanded ? "ml-72" : "ml-16"
        )}
      />
    </>
  );
}

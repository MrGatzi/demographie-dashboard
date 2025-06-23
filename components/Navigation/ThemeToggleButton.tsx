"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ThemeToggleButtonProps {
  isMobile?: boolean;
  isExpanded?: boolean;
}

export default function ThemeToggleButton({
  isMobile,
  isExpanded,
}: ThemeToggleButtonProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Render nothing on server-side and while mounting to avoid hydration mismatch
  if (!mounted) {
    return (
      <button
        className={cn(
          "w-full flex items-center transition-all duration-200 rounded-md text-sm",
          isMobile ? "h-12" : "h-11",
          !isExpanded && !isMobile ? "justify-center px-0" : "px-3",
          "text-[--theme-text] hover:text-[--theme-text-hover] hover:bg-[--theme-bg-hover]"
        )}
      >
        <Moon
          className={cn(
            "w-5 h-5 flex-shrink-0 text-[--theme-moon]",
            (isExpanded || isMobile) && "mr-3"
          )}
        />
        {(isExpanded || isMobile) && (
          <span className="truncate">Dark Mode</span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "w-full flex items-center transition-all duration-200 rounded-md text-sm",
        isMobile ? "h-12" : "h-11",
        !isExpanded && !isMobile ? "justify-center px-0" : "px-3",
        "text-[--theme-text] hover:text-[--theme-text-hover] hover:bg-[--theme-bg-hover]"
      )}
    >
      {theme === "dark" ? (
        <Sun
          className={cn(
            "w-5 h-5 flex-shrink-0 text-[--theme-sun]",
            (isExpanded || isMobile) && "mr-3"
          )}
        />
      ) : (
        <Moon
          className={cn(
            "w-5 h-5 flex-shrink-0 text-[--theme-moon]",
            (isExpanded || isMobile) && "mr-3"
          )}
        />
      )}
      {(isExpanded || isMobile) && (
        <span className="truncate">
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
}

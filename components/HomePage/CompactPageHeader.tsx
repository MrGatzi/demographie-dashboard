import { Button } from "@/components/ui/button";
import { Building2, ExternalLink, Info, RefreshCw } from "lucide-react";
import Link from "next/link";

interface CompactPageHeaderProps {
  onRefetch: () => void;
  isLoading: boolean;
}

export default function CompactPageHeader({
  onRefetch,
  isLoading,
}: CompactPageHeaderProps) {
  return (
    <div className="mb-8 bg-white/50 backdrop-blur-sm rounded-lg shadow-sm border overflow-hidden">
      {/* Mobile Layout */}
      <div className="block sm:hidden">
        {/* Top row - Logo and main actions */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent truncate">
                Austrian Parliament
              </h1>
              <p className="text-xs text-muted-foreground">
                Demographics Dashboard
              </p>
            </div>
          </div>

          {/* Primary action button */}
          <Button
            onClick={onRefetch}
            disabled={isLoading}
            size="sm"
            className="flex-shrink-0"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Bottom row - Secondary actions */}
        <div className="flex items-center justify-center space-x-2 p-3">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="flex-1 max-w-[120px]"
          >
            <Link href="/about">
              <Info className="w-4 h-4 mr-2" />
              About
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              window.open(
                "https://www.parlament.gv.at/recherchieren/open-data/",
                "_blank"
              )
            }
            className="flex-1 max-w-[120px]"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            API Docs
          </Button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-center justify-between p-4">
        {/* Left side - Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Austrian Parliament
            </h1>
            <p className="text-sm text-muted-foreground">
              Demographics Dashboard
            </p>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/about">
              <Info className="w-4 h-4 mr-2" />
              About
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              window.open(
                "https://www.parlament.gv.at/recherchieren/open-data/",
                "_blank"
              )
            }
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            API Docs
          </Button>

          <Button onClick={onRefetch} disabled={isLoading} size="sm">
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

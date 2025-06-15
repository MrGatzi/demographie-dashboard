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
    <div className="flex items-center justify-between mb-8 bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-sm border">
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
  );
}

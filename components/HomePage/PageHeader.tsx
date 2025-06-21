import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, ExternalLink, Info, RefreshCw } from "lucide-react";

interface PageHeaderProps {
  onRefetch: () => void;
  isLoading: boolean;
}

export default function PageHeader({ onRefetch, isLoading }: PageHeaderProps) {
  return (
    <div className="text-center space-y-6 mb-12">
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-1 -right-1">
              <Badge variant="secondary" className="text-xs px-2 py-1">
                AT
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Austrian Parliament
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-muted-foreground">
            Demographics Dashboard
          </h2>
        </div>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore current members of the Austrian National Council with detailed
          demographics, party affiliations, and interactive filtering
          capabilities.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button
          onClick={onRefetch}
          disabled={isLoading}
          size="lg"
          className="min-w-[160px]"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() =>
            window.open(
              "https://www.parlament.gv.at/recherchieren/open-data/",
              "_blank"
            )
          }
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          API Documentation
        </Button>
      </div>

      <div className="flex justify-center">
        <Badge
          variant="outline"
          className="flex items-center space-x-2 px-4 py-2"
        >
          <Info className="w-3 h-3" />
          <span>Data sourced from Austrian Parliament Open Data API</span>
        </Badge>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, RefreshCw } from "lucide-react";

interface MapHeaderProps {
  onRefetch: () => void;
  isLoading: boolean;
}

export function MapHeader({ onRefetch, isLoading }: MapHeaderProps) {
  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-xl flex items-center justify-center">
              <Map className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                Electoral Districts Map
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Explore parliament members by electoral district
              </p>
            </div>
          </div>

          <Button
            onClick={onRefetch}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="shrink-0 w-full sm:w-auto"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh Data
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}

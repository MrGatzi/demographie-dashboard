import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, RefreshCw } from "lucide-react";

interface MapHeaderProps {
  onRefetch: () => void;
  isLoading: boolean;
}

export function MapHeader({ onRefetch, isLoading }: MapHeaderProps) {
  return (
    <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-xl flex items-center justify-center">
              <Map className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Electoral Districts Map
              </CardTitle>
              <p className="text-muted-foreground">
                Explore parliament members by electoral district
              </p>
            </div>
          </div>
          
          <Button
            onClick={onRefetch}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="shrink-0"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
} 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  Bug,
  ExternalLink,
  RefreshCw,
  Server,
  Wifi,
} from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  isLoading?: boolean;
}

export default function ErrorState({
  message,
  onRetry,
  isLoading = false,
}: ErrorStateProps) {
  const getErrorType = (message: string) => {
    if (message.toLowerCase().includes("network")) {
      return { type: "network", icon: Wifi, color: "text-orange-500" };
    }
    if (
      message.toLowerCase().includes("server") ||
      message.toLowerCase().includes("api")
    ) {
      return { type: "server", icon: Server, color: "text-red-500" };
    }
    return { type: "general", icon: Bug, color: "text-yellow-500" };
  };

  const errorInfo = getErrorType(message);
  const ErrorIcon = errorInfo.icon;

  return (
    <div className="space-y-6">
      {/* Main Error Alert */}
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Failed to Load Parliament Data</AlertTitle>
        <AlertDescription className="mt-2">{message}</AlertDescription>
      </Alert>

      {/* Detailed Error Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ErrorIcon className={`h-5 w-5 ${errorInfo.color}`} />
            <span>Error Details</span>
            <Badge variant="outline" className="ml-auto">
              {errorInfo.type}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">
              We tried multiple approaches to fetch the Austrian Parliament
              data:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Manual pagination (fetching all pages individually)</li>
              <li>WFW_008 endpoint (members-specific API)</li>
              <li>WFW_001 endpoint (person search API)</li>
              <li>Different parameter combinations</li>
              <li>Fallback to original approach</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={onRetry} disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                window.open(
                  "https://www.parlament.gv.at/recherchieren/open-data/",
                  "_blank"
                )
              }
              className="flex-1"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Check API Status
            </Button>
          </div>

          {/* Troubleshooting Tips */}
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <h4 className="text-sm font-semibold mb-2">
              Troubleshooting Tips:
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Check your internet connection</li>
              <li>
                • The Austrian Parliament API might be temporarily unavailable
              </li>
              <li>• Try refreshing the page in a few minutes</li>
              <li>• Check the browser console for detailed error messages</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

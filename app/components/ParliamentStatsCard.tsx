import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  Building2,
  CheckCircle,
  Database,
  PieChart,
  Users,
} from "lucide-react";

interface ParliamentStatsCardProps {
  totalRecords: number;
  totalAvailable: number;
  partyStats: { [key: string]: number };
}

export default function ParliamentStatsCard({
  totalRecords,
  totalAvailable,
  partyStats,
}: ParliamentStatsCardProps) {
  const totalMembers = Object.values(partyStats).reduce(
    (sum, count) => sum + count,
    0
  );
  const isCurrentData = totalRecords >= 150 && totalRecords <= 200;
  const isHistoricalData = totalRecords > 500;

  // Get top parties
  const topParties = Object.entries(partyStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Records */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Records Retrieved
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRecords}</div>
          <p className="text-xs text-muted-foreground">
            {((totalRecords / totalAvailable) * 100).toFixed(1)}% of total
          </p>
        </CardContent>
      </Card>

      {/* Total Available */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Available</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAvailable}</div>
          <p className="text-xs text-muted-foreground">
            In parliament database
          </p>
        </CardContent>
      </Card>

      {/* Political Parties */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Political Parties
          </CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Object.keys(partyStats).length}
          </div>
          <p className="text-xs text-muted-foreground">
            Active parties represented
          </p>
        </CardContent>
      </Card>

      {/* Data Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Data Status</CardTitle>
          {isCurrentData ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isCurrentData ? (
              <Badge variant="default" className="bg-green-500">
                Current
              </Badge>
            ) : isHistoricalData ? (
              <Badge variant="secondary">Historical</Badge>
            ) : (
              <Badge variant="outline">Partial</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {isCurrentData
              ? "~183 current members"
              : isHistoricalData
              ? "Since 1918"
              : "Limited dataset"}
          </p>
        </CardContent>
      </Card>

      {/* Party Distribution Overview */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="h-5 w-5" />
            <span>Party Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {topParties.map(([party, count]) => {
              const percentage = ((count / totalMembers) * 100).toFixed(1);

              // Party colors
              const getPartyColor = (party: string) => {
                const colors: { [key: string]: string } = {
                  SPÖ: "bg-red-500",
                  ÖVP: "bg-black",
                  FPÖ: "bg-blue-600",
                  GRÜNE: "bg-green-600",
                  NEOS: "bg-pink-500",
                  CSP: "bg-yellow-600",
                  SdP: "bg-red-400",
                  GdP: "bg-gray-600",
                };
                return colors[party] || "bg-gray-400";
              };

              return (
                <div key={party} className="text-center space-y-2">
                  <div
                    className={`w-12 h-12 ${getPartyColor(
                      party
                    )} rounded-full mx-auto flex items-center justify-center`}
                  >
                    <span className="text-white font-bold text-sm">
                      {party.slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{party}</div>
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-xs text-muted-foreground">
                      {percentage}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {Object.keys(partyStats).length > 5 && (
            <div className="mt-4 text-center">
              <Badge variant="outline">
                +{Object.keys(partyStats).length - 5} more parties
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

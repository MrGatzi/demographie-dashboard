import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "lucide-react";

interface PartyDistributionProps {
  partyStats: { [key: string]: number };
}

export default function PartyDistribution({
  partyStats,
}: PartyDistributionProps) {
  const totalMembers = Object.values(partyStats).reduce(
    (sum, count) => sum + count,
    0
  );

  // Get top parties
  const topParties = Object.entries(partyStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

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
  );
}

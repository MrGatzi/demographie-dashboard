import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Building2,
  CheckCircle,
  Database,
  Users,
} from "lucide-react";
import PartyDistribution from "./PartyDistribution";
import StatCard from "./StatCard";

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
  const isCurrentData = totalRecords >= 150 && totalRecords <= 200;
  const isHistoricalData = totalRecords > 500;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Records */}
      <StatCard
        title="Records Retrieved"
        value={totalRecords}
        subtitle={`${((totalRecords / totalAvailable) * 100).toFixed(
          1
        )}% of total`}
        icon={Users}
      />

      {/* Total Available */}
      <StatCard
        title="Total Available"
        value={totalAvailable}
        subtitle="In parliament database"
        icon={Database}
      />

      {/* Political Parties */}
      <StatCard
        title="Political Parties"
        value={Object.keys(partyStats).length}
        subtitle="Active parties represented"
        icon={Building2}
      />

      {/* Data Status */}
      <StatCard
        title="Data Status"
        value={
          isCurrentData ? (
            <Badge variant="default" className="bg-green-500">
              Current
            </Badge>
          ) : isHistoricalData ? (
            <Badge variant="secondary">Historical</Badge>
          ) : (
            <Badge variant="outline">Partial</Badge>
          )
        }
        subtitle={
          isCurrentData
            ? "~183 current members"
            : isHistoricalData
            ? "Since 1918"
            : "Limited dataset"
        }
        icon={isCurrentData ? CheckCircle : AlertCircle}
        iconColor={isCurrentData ? "text-green-500" : "text-yellow-500"}
      />

      {/* Party Distribution Overview */}
      <PartyDistribution partyStats={partyStats} />
    </div>
  );
}

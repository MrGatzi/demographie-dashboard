import { useDebugStore } from "@/app/stores/debugStore";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Database } from "lucide-react";
import { ParliamentMember } from "@/app/hooks/useParliamentData";

interface ApiDebugInfoProps {
  members: ParliamentMember[];
}

export default function ApiDebugInfo({ members }: ApiDebugInfoProps) {
  const { isDebugEnabled } = useDebugStore();

  if (!isDebugEnabled) return null;

  // Get unique parties and states for statistics
  const uniqueParties = new Set(members.map(m => m.party.short_name)).size;
  const uniqueStates = new Set(members.map(m => m.state.short_code)).size;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>Database Details</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="space-y-1">
            <div className="text-muted-foreground">Active Members</div>
            <div className="font-semibold">{members.length}</div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground">Political Parties</div>
            <div className="font-semibold">{uniqueParties}</div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground">Federal States</div>
            <div className="font-semibold">{uniqueStates}</div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground">Data Source</div>
            <div className="font-semibold">Supabase</div>
          </div>
        </div>

        {/* Data Quality Indicator */}
        <div className="mt-4 pt-4 border-t">
          {members.length >= 150 && members.length <= 200 ? (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                ✅ Successfully retrieved current National Council members (~183 expected)
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                📊 Retrieved {members.length} records
                {members.length > 500
                  ? " - This appears to be historical data including all members since 1918"
                  : " - This may be a partial dataset"}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Sample Data Structure */}
        {members.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-semibold mb-2">
              Sample Member Data Structure:
            </h4>
            <div className="text-xs font-mono bg-muted p-3 rounded overflow-x-auto">
              <div>
                <strong>Name:</strong> {members[0].full_name}
              </div>
              <div>
                <strong>Party:</strong> {members[0].party.name} ({members[0].party.short_name})
              </div>
              <div>
                <strong>Electoral District:</strong> {members[0].electoral_district.name}
              </div>
              <div>
                <strong>State:</strong> {members[0].state.name} ({members[0].state.short_code})
              </div>
              <div>
                <strong>Active:</strong> {members[0].is_active ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

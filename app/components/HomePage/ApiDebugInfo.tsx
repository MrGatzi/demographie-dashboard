import { useDebugStore } from "@/app/stores/debugStore";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Database } from "lucide-react";

interface ApiDebugInfoProps {
  parliamentData: {
    rows: string[][];
    count: number;
    pages: number;
    header: Array<{
      label: string;
      hidden: boolean;
      sortable: boolean;
    }>;
  };
}

export default function ApiDebugInfo({ parliamentData }: ApiDebugInfoProps) {
  const { isDebugEnabled } = useDebugStore();

  if (!isDebugEnabled) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>API Response Details</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="space-y-1">
            <div className="text-muted-foreground">Records Retrieved</div>
            <div className="font-semibold">{parliamentData.rows.length}</div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground">Total Available</div>
            <div className="font-semibold">{parliamentData.count}</div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground">Pages Available</div>
            <div className="font-semibold">{parliamentData.pages}</div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground">Data Fields</div>
            <div className="font-semibold">{parliamentData.header.length}</div>
          </div>
        </div>

        {/* Data Quality Indicator */}
        <div className="mt-4 pt-4 border-t">
          {parliamentData.rows.length >= 150 &&
          parliamentData.rows.length <= 200 ? (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                ✅ Successfully retrieved current National Council members (~183
                expected)
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                📊 Retrieved {parliamentData.rows.length} records
                {parliamentData.rows.length > 500
                  ? " - This appears to be historical data including all members since 1918"
                  : " - This may be a partial dataset"}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Sample Data Structure */}
        {parliamentData.rows.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-semibold mb-2">
              Sample Member Data Structure:
            </h4>
            <div className="text-xs font-mono bg-muted p-3 rounded overflow-x-auto">
              <div>
                <strong>[0]:</strong> {parliamentData.rows[0][0]} (Name)
              </div>
              <div>
                <strong>[1]:</strong>{" "}
                {parliamentData.rows[0][1]?.substring(0, 50)}... (Party HTML)
              </div>
              <div>
                <strong>[2]:</strong> {parliamentData.rows[0][2]} (Electoral
                District)
              </div>
              <div>
                <strong>[3]:</strong> {parliamentData.rows[0][3]} (State HTML)
              </div>
              <div>
                <strong>[4]:</strong> {parliamentData.rows[0][4]} (Last Name)
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

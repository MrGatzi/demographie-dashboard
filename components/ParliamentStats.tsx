interface ParliamentStatsProps {
  totalRecords: number;
  totalAvailable: number;
  partyStats: { [key: string]: number };
}

export default function ParliamentStats({
  totalRecords,
  totalAvailable,
  partyStats,
}: ParliamentStatsProps) {
  const totalMembers = Object.values(partyStats).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-3">Parliament Overview</h2>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-3xl font-bold">{totalRecords}</div>
          <div className="text-green-100">Records Retrieved</div>
        </div>
        <div>
          <div className="text-3xl font-bold">{totalAvailable}</div>
          <div className="text-green-100">Total Available</div>
        </div>
        <div>
          <div className="text-3xl font-bold">
            {Object.keys(partyStats).length}
          </div>
          <div className="text-green-100">Political Parties</div>
        </div>
      </div>

      {/* Show data type indicator */}
      <div className="mt-4 bg-white bg-opacity-20 rounded p-3">
        {totalRecords >= 150 && totalRecords <= 200 ? (
          <p className="text-sm">
            ✅ Showing Current National Council Members (~183 expected)
          </p>
        ) : (
          <p className="text-sm">
            📊 Showing {totalRecords} records
            {totalRecords > 500
              ? " (Historical data - all members since 1918)"
              : ""}
          </p>
        )}
      </div>
    </div>
  );
}

interface ParliamentMemberProps {
  member: string[];
  headers: Array<{
    label: string;
    hidden: boolean;
    sortable: boolean;
  }>;
}

export default function ParliamentMember({
  member,
  headers,
}: ParliamentMemberProps) {
  // Extract member information from the row data
  const getName = () => {
    // Name is typically in the first few columns
    const nameHtml = member[1] || member[0] || "";
    const nameMatch = nameHtml.match(/>([^<]+)</);
    return nameMatch ? nameMatch[1].trim() : "Unknown";
  };

  const getParty = () => {
    // Party info is typically in column 3
    const partyHtml = member[3] || "";
    const partyMatch = partyHtml.match(/>([A-ZÜÖÄ-]+)</);
    return partyMatch ? partyMatch[1] : "Unknown";
  };

  const getState = () => {
    // State/Region info is typically in column 4 or 5
    const stateHtml = member[4] || member[5] || "";
    const stateMatch = stateHtml.match(/>([^<]+)</);
    return stateMatch ? stateMatch[1].trim() : "Unknown";
  };

  const getBirthDate = () => {
    // Birth date might be in various columns
    for (let i = 0; i < member.length; i++) {
      const cellContent = member[i] || "";
      // Look for date patterns (DD.MM.YYYY)
      const dateMatch = cellContent.match(/(\d{1,2}\.\d{1,2}\.\d{4})/);
      if (dateMatch) {
        return dateMatch[1];
      }
    }
    return "Unknown";
  };

  const name = getName();
  const party = getParty();
  const state = getState();
  const birthDate = getBirthDate();

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
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-3">
        <div
          className={`w-4 h-4 rounded-full ${getPartyColor(
            party
          )} mt-1 flex-shrink-0`}
        ></div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {name}
          </h3>
          <div className="mt-1 space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Party:</span> {party}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">State:</span> {state}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Born:</span> {birthDate}
            </p>
          </div>
        </div>
      </div>

      {/* Debug info - show raw data structure */}
      <details className="mt-3">
        <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
          Debug: Raw Data
        </summary>
        <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
          {member.map((cell, index) => (
            <div key={index} className="mb-1">
              <strong>Col {index}:</strong> {cell?.substring(0, 100)}...
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}

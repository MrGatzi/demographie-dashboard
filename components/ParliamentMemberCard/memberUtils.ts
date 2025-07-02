// Data extraction utilities for parliament member data
export const extractMemberData = (member: string[]) => {
  const getName = () => {
    // Full name is at index 0: "Auer Katrin, Mag."
    return member[0] || "Unknown Member";
  };

  const getParty = () => {
    // Party info is at index 1: "<span title=\"...\">SPÖ</span>"
    const partyHtml = member[1] || "";
    const partyMatch = partyHtml.match(/>([^<]+)</);
    return partyMatch ? partyMatch[1] : "Independent";
  };

  const getElectoralDistrict = () => {
    // Electoral district is at index 2: "4D Traunviertel"
    return member[2] || "Unknown District";
  };

  const getState = () => {
    // State info is at index 3: "<span title=\"Oberösterreich\">O</span>"
    const stateHtml = member[3] || "";
    const stateMatch = stateHtml.match(/title="([^"]+)"/);
    return stateMatch ? stateMatch[1] : "Unknown State";
  };

  const getLastName = () => {
    // Last name is at index 4: "Auer"
    return member[4] || "";
  };

  const getProfileUrl = () => {
    // Profile URL is at index 7: "/person/30688"
    const profilePath = member[7] || member[11]; // Also available at index 11
    return profilePath ? `https://www.parlament.gv.at${profilePath}` : null;
  };

  const getDetailedInfo = () => {
    // Detailed info is at index 6 with HTML formatting
    const detailsHtml = member[6] || "";
    return detailsHtml;
  };

  const getFirstName = () => {
    // Extract first name from full name
    const fullName = getName();
    const nameParts = fullName.split(" ");
    if (nameParts.length >= 2) {
      // Handle "Auer Katrin, Mag." format
      const withoutTitle = fullName.replace(/,.*$/, ""); // Remove titles after comma
      const parts = withoutTitle.split(" ");
      return parts[1] || parts[0]; // Second part is usually first name
    }
    return fullName;
  };

  return {
    name: getName(),
    party: getParty(),
    electoralDistrict: getElectoralDistrict(),
    state: getState(),
    lastName: getLastName(),
    profileUrl: getProfileUrl(),
    detailedInfo: getDetailedInfo(),
    firstName: getFirstName(),
  };
};

// Party styling configuration
export const getPartyStyle = (party: string) => {
  const styles: {
    [key: string]: {
      bg: string;
      text: string;
    };
  } = {
    SPÖ: { bg: "bg-red-500", text: "text-white" },
    ÖVP: { bg: "bg-black", text: "text-white" },
    FPÖ: { bg: "bg-blue-600", text: "text-white" },
    GRÜNE: { bg: "bg-green-600", text: "text-white" },
    NEOS: { bg: "bg-pink-500", text: "text-white" },
    CSP: { bg: "bg-yellow-600", text: "text-white" },
    SdP: { bg: "bg-red-400", text: "text-white" },
    GdP: { bg: "bg-gray-600", text: "text-white" },
  };
  return styles[party] || { bg: "bg-gray-400", text: "text-white" };
};

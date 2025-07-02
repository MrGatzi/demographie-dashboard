// Party color mapping for UI
export const PARTY_COLORS: { [key: string]: string } = {
  SPÖ: "#E31E24",
  ÖVP: "#000000",
  FPÖ: "#00529B",
  GRÜNE: "#4CAF50",
  NEOS: "#FF6B9D",
  CSP: "#FFD700",
  SdP: "#FF6B6B",
  GdP: "#6C757D",
};

// State name mapping
export const STATE_NAMES: { [key: string]: string } = {
  O: "Oberösterreich",
  N: "Niederösterreich",
  W: "Wien",
  S: "Salzburg",
  T: "Tirol",
  V: "Vorarlberg",
  K: "Kärnten",
  B: "Burgenland",
  St: "Steiermark",
};

// Parliament API configuration
export const PARLIAMENT_API_CONFIG = {
  BASE_URL: "https://www.parlament.gv.at",
  URL: "https://www.parlament.gv.at/Filter/api/json/post?jsMode=EVAL&FBEZ=WFW_002&listeId=undefined&showAll=true&export=true",
  USER_AGENT: "Demographics-Dashboard/1.0",
  POST_BODY: {
    STEP: ["1000"],
    NRBR: ["NR"],
    GP: ["AKT"],
    R_WF: ["FR"],
    R_PBW: ["WK"],
    M: ["M"],
    W: ["W"],
  },
};

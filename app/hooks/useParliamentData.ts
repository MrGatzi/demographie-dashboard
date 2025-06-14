import axios from "axios";
import { useEffect, useState } from "react";

interface ParliamentResponse {
  pages: number;
  count: number;
  header: Array<{
    label: string;
    hidden: boolean;
    sortable: boolean;
  }>;
  rows: string[][];
}

export function useParliamentData() {
  const [parliamentData, setParliamentData] =
    useState<ParliamentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParliamentData = async () => {
    setLoading(true);
    setError(null);

    try {
      const postBody = {
        STEP: ["1000"],
        NRBR: ["NR"],
        GP: ["AKT"],
        R_WF: ["FR"],
        R_PBW: ["WK"],
        M: ["M"],
        W: ["W"],
      };

      const response = await axios.post(
        "https://www.parlament.gv.at/Filter/api/json/post?jsMode=EVAL&FBEZ=WFW_002&listeId=undefined&showAll=true&export=true",
        postBody,
        {
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Demographics-Dashboard/1.0",
          },
        }
      );
      console.log("response", response.data);
      setParliamentData(response.data);
    } catch (err) {
      setError("Failed to fetch parliament data from Austrian Parliament API.");
      console.error("Error fetching parliament data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch data when hook is used
  useEffect(() => {
    fetchParliamentData();
  }, []);

  return {
    parliamentData,
    loading,
    error,
    refetch: fetchParliamentData,
  };
}

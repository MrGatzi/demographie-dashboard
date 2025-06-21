import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';

// Simple type for parliament member with all relationships - matching Supabase types
export interface ParliamentMember {
  id: number;
  full_name: string;
  first_name: string | null;
  last_name: string;
  title: string | null;
  profile_url: string | null;
  detailed_info: string | null;
  is_active: boolean;
  fetched_at: string;
  party: {
    id: number;
    name: string;
    short_name: string;
    color: string | null;
  };
  state: {
    id: number;
    name: string;
    short_code: string;
  };
  electoral_district: {
    id: number;
    code: string;
    name: string;
    full_name: string;
  };
}

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useParliamentData() {
  const [members, setMembers] = useState<ParliamentMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from("parliament_members")
        .select(`
          *,
          party:parties(*),
          state:states(*),
          electoral_district:electoral_districts(*)
        `)
        .eq('is_active', true)
        .order('last_name', { ascending: true });

      if (supabaseError) {
        throw supabaseError;
      }

      setMembers(data || []);
      console.log(`Loaded ${data?.length || 0} parliament members`);
    } catch (err) {
      setError("Failed to fetch parliament data");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    members,
    loading,
    error,
    refetch: fetchData,
  };
}


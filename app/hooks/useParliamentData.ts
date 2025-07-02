import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import type { Prisma } from "../generated/prisma";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type ParliamentMemberWithRelations = Prisma.ParliamentMemberGetPayload<{
  include: {
    party: true;
    state: true;
    electoralDistrict: true;
  };
}>;

export function useParliamentData() {
  const [members, setMembers] = useState<ParliamentMemberWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const { data, error: supabaseError } = await supabase
          .from("parliament_members")
          .select(
            `
            id,
            fullName,
            firstName,
            lastName,
            title,
            profileUrl,
            profileImageUrl,
            detailedInfo,
            isActive,
            fetchedAt,
            createdAt,
            updatedAt,
            birthDate,
            birthPlace,
            occupation,
            careerHistory,
            education,
            politicalFunctions,
            committees,
            socialMedia,
            detailedDataFetchedAt,
            party:parties(
              id,
              name,
              shortName,
              color
            ),
            state:states(
              id,
              name,
              shortCode
            ),
            electoralDistrict:electoral_districts(
              id,
              code,
              name,
              fullName
            )
          `
          )
          .eq("isActive", true)
          .order("lastName", { ascending: true });

        if (supabaseError) {
          throw supabaseError;
        }

        console.log(data);
        setMembers(data as unknown as ParliamentMemberWithRelations[]);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch members")
        );
        setLoading(false);
      }
    }

    fetchMembers();
  }, []);

  return { members, loading, error };
}

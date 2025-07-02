import { getPartyStyle } from "@/components/ParliamentMemberCard/memberUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function getMemberDetails(id: string) {
  const { data, error } = await supabase
    .from("parliament_members")
    .select(
      `
      *,
      party:parties(*),
      state:states(*),
      electoral_district:electoral_districts(*)
    `
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export default async function MemberPage({
  params,
}: {
  params: { id: string };
}) {
  const member = await getMemberDetails(params.id);
  const partyStyle = getPartyStyle(member.party.short_name);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Members
          </Button>
        </Link>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-start gap-6">
            <Avatar className="w-32 h-32">
              <AvatarImage
                src={`https://www.parlament.gv.at/download/l/${member.profile_url
                  ?.split("/")
                  .pop()}`}
              />
              <AvatarFallback>
                {member.first_name?.[0]}
                {member.last_name[0]}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{member.full_name}</h1>
                <Badge className={`${partyStyle.bg} ${partyStyle.text}`}>
                  {member.party.short_name}
                </Badge>
              </div>

              {member.title && (
                <p className="text-muted-foreground">{member.title}</p>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <dl className="space-y-2">
                <div>
                  <dt className="font-medium text-muted-foreground">State</dt>
                  <dd>{member.state.name}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">
                    Electoral District
                  </dt>
                  <dd>{member.electoral_district.full_name}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Party</dt>
                  <dd>{member.party.name}</dd>
                </div>
              </dl>
            </div>

            {(member.birth_date || member.birth_place || member.occupation) && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Personal Information
                </h2>
                <dl className="space-y-2">
                  {member.birth_date && (
                    <div>
                      <dt className="font-medium text-muted-foreground">
                        Birth Date
                      </dt>
                      <dd>
                        {new Date(member.birth_date).toLocaleDateString()}
                      </dd>
                    </div>
                  )}
                  {member.birth_place && (
                    <div>
                      <dt className="font-medium text-muted-foreground">
                        Birth Place
                      </dt>
                      <dd>{member.birth_place}</dd>
                    </div>
                  )}
                  {member.occupation && (
                    <div>
                      <dt className="font-medium text-muted-foreground">
                        Occupation
                      </dt>
                      <dd>{member.occupation}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>

          {member.career_history && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Career History</h2>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap bg-muted p-4 rounded-lg">
                  {JSON.stringify(member.career_history, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {member.political_functions && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">
                Political Functions
              </h2>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap bg-muted p-4 rounded-lg">
                  {JSON.stringify(member.political_functions, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {member.committees && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Committees</h2>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap bg-muted p-4 rounded-lg">
                  {JSON.stringify(member.committees, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {member.social_media && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Social Media</h2>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap bg-muted p-4 rounded-lg">
                  {JSON.stringify(member.social_media, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

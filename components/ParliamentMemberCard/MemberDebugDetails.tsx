import { useDebugStore } from "@/app/stores/debugStore";
import { ParliamentMember } from "@/app/hooks/useParliamentData";

interface MemberDebugDetailsProps {
  name: string;
  party: string;
  electoralDistrict: string;
  state: string;
  lastName: string;
  profileUrl: string | null | undefined;
  member: ParliamentMember;
  showDebug: boolean;
}

export default function MemberDebugDetails({
  name,
  party,
  electoralDistrict,
  state,
  lastName,
  profileUrl,
  member,
  showDebug,
}: MemberDebugDetailsProps) {
  const { isDebugEnabled } = useDebugStore();

  // Only show if both global debug is enabled AND local showDebug is true
  if (!isDebugEnabled || !showDebug) return null;

  return (
    <div className="mt-4 p-3 bg-muted rounded-lg">
      <h4 className="text-xs font-semibold mb-2 text-muted-foreground">
        Member Details
      </h4>
      <div className="space-y-2 text-xs">
        <div>
          <strong>Full Name:</strong> {name}
        </div>
        <div>
          <strong>Party:</strong> {party} ({member.party.name})
        </div>
        <div>
          <strong>Electoral District:</strong> {electoralDistrict} ({member.electoral_district.code})
        </div>
        <div>
          <strong>State:</strong> {state} ({member.state.short_code})
        </div>
        <div>
          <strong>Last Name:</strong> {lastName}
        </div>
        <div>
          <strong>Active:</strong> {member.is_active ? 'Yes' : 'No'}
        </div>
        {profileUrl && (
          <div>
            <strong>Profile:</strong>{" "}
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {profileUrl}
            </a>
          </div>
        )}
      </div>

      <h4 className="text-xs font-semibold mb-2 mt-4 text-muted-foreground">
        Database Record
      </h4>
      <div className="space-y-1 text-xs font-mono">
        <div>
          <strong>ID:</strong> {member.id}
        </div>
        <div>
          <strong>Fetched At:</strong> {new Date(member.fetched_at).toLocaleString()}
        </div>
        <div>
          <strong>Title:</strong> {member.title || 'None'}
        </div>
        <div>
          <strong>First Name:</strong> {member.first_name || 'None'}
        </div>
        {member.detailed_info && (
          <div>
            <strong>Details:</strong> {member.detailed_info.substring(0, 100)}
            {member.detailed_info.length > 100 && "..."}
          </div>
        )}
      </div>
    </div>
  );
}

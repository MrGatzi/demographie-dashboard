import { useDebugStore } from "@/app/stores/debugStore";

interface MemberDebugDetailsProps {
  name: string;
  party: string;
  electoralDistrict: string;
  state: string;
  lastName: string;
  profileUrl: string | null;
  member: string[];
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
          <strong>Party:</strong> {party}
        </div>
        <div>
          <strong>Electoral District:</strong> {electoralDistrict}
        </div>
        <div>
          <strong>State:</strong> {state}
        </div>
        <div>
          <strong>Last Name:</strong> {lastName}
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
        Raw API Data
      </h4>
      <div className="space-y-1 text-xs font-mono">
        {member.map((cell, cellIndex) => (
          <div key={cellIndex} className="flex">
            <span className="text-muted-foreground w-12 flex-shrink-0">
              [{cellIndex}]:
            </span>
            <span className="break-all">
              {cell === null ? "null" : String(cell).substring(0, 80)}
              {cell && String(cell).length > 80 && "..."}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

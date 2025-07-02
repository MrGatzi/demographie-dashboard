import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Search, Users } from "lucide-react";
import { ParliamentMember } from "../../app/generated/prisma";
import ParliamentMemberCard from "../ParliamentMemberCard";

interface MembersGridProps {
  filteredMembers: ParliamentMember[];
  onClearFilters?: () => void;
}

export default function MembersGrid({
  filteredMembers,
  onClearFilters,
}: MembersGridProps) {
  if (filteredMembers.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">No members found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or party filter to find members.
              </p>
            </div>
            <Button onClick={onClearFilters} variant="outline">
              Clear All Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold flex items-center space-x-2">
          <Users className="h-6 w-6" />
          <span>Parliament Members</span>
        </h3>
        <Badge variant="outline" className="flex items-center space-x-2">
          <CheckCircle2 className="h-3 w-3" />
          <span>{filteredMembers.length} members</span>
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <ParliamentMemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}

import { Eye, EyeOff, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge/Badge";

export function TourStatusBadge({ published, featured }: { published: boolean; featured?: boolean }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      {published ? (
        <Badge variant="success" icon={<Eye className="size-3" />}>
          Published
        </Badge>
      ) : (
        <Badge variant="neutral" icon={<EyeOff className="size-3" />}>
          Draft
        </Badge>
      )}
      {featured && (
        <Badge variant="accent" icon={<Star className="size-3" />}>
          Featured
        </Badge>
      )}
    </span>
  );
}
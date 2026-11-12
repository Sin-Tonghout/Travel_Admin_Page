import { Eye, EyeOff, MoreHorizontal, Pencil, Star, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown/DropdownMenu";
import { useSetDestinationFeatured, useSetDestinationPublished } from "@/features/destinations/hooks/useDestinations";
import { useCurrentUser } from "@/hooks/useAuth";
import type { DestinationListItem } from "@/types/destination";

interface DestinationRowActionsProps {
  destination: DestinationListItem;
  onDelete: (destination: DestinationListItem) => void;
}

export function DestinationRowActions({ destination, onDelete }: DestinationRowActionsProps) {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const publish = useSetDestinationPublished();
  const feature = useSetDestinationFeatured();
  // Starting rule: only Super Admin and Admin can delete. The server must enforce it too.
  const canDelete = user.role === "super_admin" || user.role === "admin";

  return (
    // Stops clicks (including ones from the portaled menu) from also opening the row.
    <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton
            label={`Actions for ${destination.name}`}
            icon={<MoreHorizontal className="size-4" />}
            variant="ghost"
            size="icon-sm"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem icon={<Eye />} onSelect={() => navigate(`/admin/destinations/${destination.id}`)}>
            View details
          </DropdownMenuItem>
          <DropdownMenuItem icon={<Pencil />} onSelect={() => navigate(`/admin/destinations/${destination.id}/edit`)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            icon={destination.published ? <EyeOff /> : <Eye />}
            onSelect={() => publish.mutate({ id: destination.id, published: !destination.published })}
          >
            {destination.published ? "Unpublish" : "Publish"}
          </DropdownMenuItem>
          <DropdownMenuItem
            icon={<Star />}
            disabled={!destination.published && !destination.featured}
            onSelect={() => feature.mutate({ id: destination.id, featured: !destination.featured })}
          >
            {destination.featured ? "Remove from featured" : "Add to featured"}
          </DropdownMenuItem>
          {canDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem icon={<Trash2 />} destructive onSelect={() => onDelete(destination)}>
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
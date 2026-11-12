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
import { useSetTourFeatured, useSetTourPublished } from "@/features/tours/hooks/useTours";
import { useCurrentUser } from "@/hooks/useAuth";
import type { TourListItem } from "@/types/tour";

interface TourRowActionsProps {
  tour: TourListItem;
  onDelete: (tour: TourListItem) => void;
}

export function TourRowActions({ tour, onDelete }: TourRowActionsProps) {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const publish = useSetTourPublished();
  const feature = useSetTourFeatured();
  // Starting rule: only Super Admin and Admin can delete. The server must enforce it too.
  const canDelete = user.role === "super_admin" || user.role === "admin";

  return (
    // Stops clicks (including ones from the portaled menu) from also opening the row.
    <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton
            label={`Actions for ${tour.name}`}
            icon={<MoreHorizontal className="size-4" />}
            variant="ghost"
            size="icon-sm"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem icon={<Eye />} onSelect={() => navigate(`/admin/tours/${tour.id}`)}>
            View details
          </DropdownMenuItem>
          <DropdownMenuItem icon={<Pencil />} onSelect={() => navigate(`/admin/tours/${tour.id}/edit`)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            icon={tour.published ? <EyeOff /> : <Eye />}
            onSelect={() => publish.mutate({ id: tour.id, published: !tour.published })}
          >
            {tour.published ? "Unpublish" : "Publish"}
          </DropdownMenuItem>
          <DropdownMenuItem
            icon={<Star />}
            disabled={!tour.published && !tour.featured}
            onSelect={() => feature.mutate({ id: tour.id, featured: !tour.featured })}
          >
            {tour.featured ? "Remove from featured" : "Add to featured"}
          </DropdownMenuItem>
          {canDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem icon={<Trash2 />} destructive onSelect={() => onDelete(tour)}>
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
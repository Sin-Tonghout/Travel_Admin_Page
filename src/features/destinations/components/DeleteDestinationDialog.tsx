import { Alert } from "@/components/ui/alert/Alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog/Dialog";
import { useDeleteDestination } from "@/features/destinations/hooks/useDestinations";
import type { DestinationListItem } from "@/types/destination";

interface DeleteDestinationDialogProps {
  destination: DestinationListItem | null;
  onClose: () => void;
  /** Called after the destination was deleted successfully. */
  onDeleted?: () => void;
}

function DeleteBody({
  destination,
  onClose,
  onDeleted,
}: {
  destination: DestinationListItem;
  onClose: () => void;
  onDeleted?: () => void;
}) {
  const remove = useDeleteDestination();
  const blocked = destination.tourCount > 0;

  return (
    <DialogContent
      size="sm"
      title={`Delete "${destination.name}"?`}
      description={blocked ? undefined : "This permanently removes the destination and its photos. This can't be undone."}
      footer={
        blocked ? (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        ) : (
          <>
            <Button variant="ghost" onClick={onClose} disabled={remove.isPending}>
              Keep destination
            </Button>
            <Button
              variant="destructive"
              loading={remove.isPending}
              onClick={() =>
                remove.mutate(destination.id, {
                  onSuccess: () => {
                    onClose();
                    onDeleted?.();
                  },
                })
              }
            >
              Delete destination
            </Button>
          </>
        )
      }
    >
      {blocked && (
        <Alert variant="warning" title="This destination can't be deleted">
          {destination.tourCount} {destination.tourCount === 1 ? "tour uses" : "tours use"} it. Move or delete those tours
          first, or unpublish the destination instead.
        </Alert>
      )}
    </DialogContent>
  );
}

export function DeleteDestinationDialog({ destination, onClose, onDeleted }: DeleteDestinationDialogProps) {
  return (
    <Dialog open={destination !== null} onOpenChange={(open) => !open && onClose()}>
      {destination && <DeleteBody key={destination.id} destination={destination} onClose={onClose} onDeleted={onDeleted} />}
    </Dialog>
  );
}
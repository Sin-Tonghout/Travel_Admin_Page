import { Alert } from "@/components/ui/alert/Alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog/Dialog";
import { useDeleteTour } from "@/features/tours/hooks/useTours";
import type { TourListItem } from "@/types/tour";

interface DeleteTourDialogProps {
  tour: TourListItem | null;
  onClose: () => void;
  /** Called after the tour was deleted successfully. */
  onDeleted?: () => void;
}

function DeleteBody({ tour, onClose, onDeleted }: { tour: TourListItem; onClose: () => void; onDeleted?: () => void }) {
  const remove = useDeleteTour();
  const blocked = tour.bookingCount > 0;

  return (
    <DialogContent
      size="sm"
      title={`Delete "${tour.name}"?`}
      description={blocked ? undefined : "This permanently removes the tour and its photos. This can't be undone."}
      footer={
        blocked ? (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        ) : (
          <>
            <Button variant="ghost" onClick={onClose} disabled={remove.isPending}>
              Keep tour
            </Button>
            <Button
              variant="destructive"
              loading={remove.isPending}
              onClick={() =>
                remove.mutate(tour.id, {
                  onSuccess: () => {
                    onClose();
                    onDeleted?.();
                  },
                })
              }
            >
              Delete tour
            </Button>
          </>
        )
      }
    >
      {blocked && (
        <Alert variant="warning" title="This tour can't be deleted">
          It has {tour.bookingCount} {tour.bookingCount === 1 ? "booking" : "bookings"}. Unpublish it instead, so it
          disappears from the website but keeps its booking history.
        </Alert>
      )}
    </DialogContent>
  );
}

export function DeleteTourDialog({ tour, onClose, onDeleted }: DeleteTourDialogProps) {
  return (
    <Dialog open={tour !== null} onOpenChange={(open) => !open && onClose()}>
      {tour && <DeleteBody key={tour.id} tour={tour} onClose={onClose} onDeleted={onDeleted} />}
    </Dialog>
  );
}
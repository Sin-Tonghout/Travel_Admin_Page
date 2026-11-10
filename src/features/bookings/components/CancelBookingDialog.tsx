import { useState } from "react";
import { FormField } from "@/components/shared/FormField";
import { Alert } from "@/components/ui/alert/Alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog/Dialog";
import { Select } from "@/components/ui/select/Select";
import { Textarea } from "@/components/ui/textarea/Textarea";
import { useChangeBookingStatus } from "@/features/bookings/hooks/useBookings";
import type { BookingRecord } from "@/types/booking";

const reasons = ["Customer request", "Payment issue", "Tour unavailable", "Duplicate booking", "Other"];

function CancelDialogBody({ booking, onClose }: { booking: BookingRecord; onClose: () => void }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [touched, setTouched] = useState(false);
  const { mutate, isPending } = useChangeBookingStatus();

  const needsDetails = reason === "Other";
  const reasonError = touched && !reason ? "Choose a reason" : undefined;
  const detailsError = touched && needsDetails && details.trim().length < 3 ? "Add a short explanation" : undefined;

  const submit = () => {
    setTouched(true);
    if (!reason || (needsDetails && details.trim().length < 3)) return;
    const text = details.trim();
    mutate(
      { id: booking.id, next: "cancelled", reason: text ? `${reason}: ${text}` : reason },
      { onSuccess: onClose },
    );
  };

  return (
    <DialogContent
      size="sm"
      title={`Cancel booking ${booking.id}?`}
      description="This can't be undone. The reason is saved in the booking history."
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isPending}>
            Keep booking
          </Button>
          <Button variant="destructive" loading={isPending} onClick={submit}>
            Cancel booking
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {booking.payment === "paid" && (
          <Alert variant="warning" title="This booking is already paid">
            Remember to issue a refund from Payments after cancelling.
          </Alert>
        )}
        <FormField id="cancel-reason" label="Reason" required error={reasonError}>
          <Select
            id="cancel-reason"
            value={reason}
            onValueChange={setReason}
            placeholder="Choose a reason"
            invalid={!!reasonError}
            options={reasons.map((r) => ({ value: r, label: r }))}
          />
        </FormField>
        <FormField id="cancel-details" label={needsDetails ? "Details" : "Details (optional)"} required={needsDetails} error={detailsError}>
          <Textarea
            id="cancel-details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            invalid={!!detailsError}
            placeholder="Anything the team should know"
          />
        </FormField>
      </div>
    </DialogContent>
  );
}

export function CancelBookingDialog({ booking, onClose }: { booking: BookingRecord | null; onClose: () => void }) {
  return (
    <Dialog open={booking !== null} onOpenChange={(open) => !open && onClose()}>
      {booking && <CancelDialogBody key={booking.id} booking={booking} onClose={onClose} />}
    </Dialog>
  );
}
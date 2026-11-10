import { CheckCheck, CircleCheck, CircleX, Eye, MoreHorizontal, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown/DropdownMenu";
import { useChangeBookingStatus } from "@/features/bookings/hooks/useBookings";
import { isEditable, transitionBlocker } from "@/features/bookings/lib/workflow";
import type { BookingRecord } from "@/types/booking";

interface BookingRowActionsProps {
  record: BookingRecord;
  onCancel: (booking: BookingRecord) => void;
}

export function BookingRowActions({ record, onCancel }: BookingRowActionsProps) {
  const navigate = useNavigate();
  const { mutate } = useChangeBookingStatus();

  const confirmBlocker = record.status === "pending" ? transitionBlocker(record, "confirmed") : null;
  const completeBlocker = record.status === "confirmed" ? transitionBlocker(record, "completed") : null;

  return (
    // Stops clicks (including ones from the portaled menu) from also opening the row.
    <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton
            label={`Actions for ${record.id}`}
            icon={<MoreHorizontal className="size-4" />}
            variant="ghost"
            size="icon-sm"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem icon={<Eye />} onSelect={() => navigate(`/admin/bookings/${record.id}`)}>
            View details
          </DropdownMenuItem>
          {isEditable(record) && (
            <DropdownMenuItem icon={<Pencil />} onSelect={() => navigate(`/admin/bookings/${record.id}/edit`)}>
              Edit
            </DropdownMenuItem>
          )}

          {record.status === "pending" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                icon={<CircleCheck />}
                disabled={confirmBlocker !== null}
                onSelect={() => mutate({ id: record.id, next: "confirmed" })}
              >
                {confirmBlocker ? "Confirm (verify payment first)" : "Confirm booking"}
              </DropdownMenuItem>
            </>
          )}

          {record.status === "confirmed" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                icon={<CheckCheck />}
                disabled={completeBlocker !== null}
                onSelect={() => mutate({ id: record.id, next: "completed" })}
              >
                {completeBlocker ? "Complete (after travel date)" : "Mark as completed"}
              </DropdownMenuItem>
            </>
          )}

          {isEditable(record) && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem icon={<CircleX />} destructive onSelect={() => onCancel(record)}>
                Cancel booking
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast/Toaster";
import {
  changeBookingStatus,
  createBooking,
  getBooking,
  listBookings,
  markBookingPaid,
  updateBooking,
} from "@/features/bookings/services/bookingService";
import { useCurrentUser } from "@/hooks/useAuth";
import { ApiError } from "@/services/api-error";
import { queryKeys } from "@/services/query-keys";
import type { BookingFilters, BookingInput, BookingStatus } from "@/types/booking";

const errorMessage = (err: unknown) => (err instanceof Error ? err.message : "Something went wrong.");

export function useBookings(filters: BookingFilters) {
  return useQuery({
    queryKey: queryKeys.bookings.list(JSON.stringify(filters)),
    queryFn: () => listBookings(filters),
    placeholderData: keepPreviousData,
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: queryKeys.bookings.detail(id),
    queryFn: () => getBooking(id),
    retry: (count, err) => !(err instanceof ApiError && err.status === 404) && count < 1,
  });
}

function useInvalidateBookings() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: queryKeys.bookings.all });
}

const statusToasts: Record<BookingStatus, string> = {
  pending: "moved back to pending",
  confirmed: "confirmed",
  completed: "marked as completed",
  cancelled: "cancelled",
};

export function useChangeBookingStatus() {
  const user = useCurrentUser();
  const invalidate = useInvalidateBookings();

  return useMutation({
    mutationFn: (v: { id: string; next: BookingStatus; reason?: string }) =>
      changeBookingStatus(v.id, v.next, user.name, v.reason),
    onSuccess: (record) => {
      invalidate();
      toast.success(`Booking ${record.id} ${statusToasts[record.status]}`);
    },
    onError: (err) => toast.error(errorMessage(err)),
  });
}

export function useMarkBookingPaid() {
  const user = useCurrentUser();
  const invalidate = useInvalidateBookings();

  return useMutation({
    mutationFn: (id: string) => markBookingPaid(id, user.name),
    onSuccess: (record) => {
      invalidate();
      toast.success(`Payment for ${record.id} marked as paid`);
    },
    onError: (err) => toast.error(errorMessage(err)),
  });
}

export function useCreateBooking() {
  const user = useCurrentUser();
  const invalidate = useInvalidateBookings();

  return useMutation({
    mutationFn: (input: BookingInput) => createBooking(input, user.name),
    onSuccess: (record) => {
      invalidate();
      toast.success(`Booking ${record.id} created`);
    },
    onError: (err) => toast.error(errorMessage(err)),
  });
}

export function useUpdateBooking(id: string) {
  const user = useCurrentUser();
  const invalidate = useInvalidateBookings();

  return useMutation({
    mutationFn: (input: BookingInput) => updateBooking(id, input, user.name),
    onSuccess: (record) => {
      invalidate();
      toast.success(`Booking ${record.id} updated`);
    },
    onError: (err) => toast.error(errorMessage(err)),
  });
}
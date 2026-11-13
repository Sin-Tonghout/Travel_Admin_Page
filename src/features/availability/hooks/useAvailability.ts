import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast/Toaster";
import {
  clearDayAvailability,
  getMonthAvailability,
  listAvailabilityTours,
  setDayAvailability,
} from "@/features/availability/services/availabilityService";
import { queryKeys } from "@/services/query-keys";
import type { DayAvailabilityInput } from "@/types/availability";

const errorMessage = (err: unknown) => (err instanceof Error ? err.message : "Something went wrong.");

export function useAvailabilityTours() {
  return useQuery({ queryKey: queryKeys.availability.tours, queryFn: listAvailabilityTours });
}

export function useMonthAvailability(tourId: string | undefined, month: string) {
  return useQuery({
    queryKey: queryKeys.availability.month(tourId ?? "", month),
    queryFn: () => getMonthAvailability(tourId!, month),
    enabled: Boolean(tourId),
    placeholderData: keepPreviousData,
  });
}

export function useSetDayAvailability(tourId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { date: string; input: DayAvailabilityInput }) => setDayAvailability(tourId, v.date, v.input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.availability.all });
      toast.success("Availability saved");
    },
    onError: (err) => toast.error(errorMessage(err)),
  });
}

export function useClearDayAvailability(tourId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (date: string) => clearDayAvailability(tourId, date),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.availability.all });
      toast.success("Date reset to the defaults");
    },
    onError: (err) => toast.error(errorMessage(err)),
  });
}
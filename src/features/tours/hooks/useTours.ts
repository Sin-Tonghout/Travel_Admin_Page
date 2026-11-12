import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast/Toaster";
import {
  createTour,
  deleteTour,
  getTour,
  listTours,
  setTourFeatured,
  setTourPublished,
  updateTour,
} from "@/features/tours/services/tourService";
import { ApiError } from "@/services/api-error";
import { queryKeys } from "@/services/query-keys";
import type { TourFilters, TourInput } from "@/types/tour";

const errorMessage = (err: unknown) => (err instanceof Error ? err.message : "Something went wrong.");

export function useTours(filters: TourFilters) {
  return useQuery({
    queryKey: queryKeys.tours.list(JSON.stringify(filters)),
    queryFn: () => listTours(filters),
    placeholderData: keepPreviousData,
  });
}

export function useTour(id: string) {
  return useQuery({
    queryKey: queryKeys.tours.detail(id),
    queryFn: () => getTour(id),
    retry: (count, err) => !(err instanceof ApiError && err.status === 404) && count < 1,
  });
}

function useInvalidateTours() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: queryKeys.tours.all });
}

export function useCreateTour() {
  const invalidate = useInvalidateTours();
  return useMutation({
    mutationFn: (input: TourInput) => createTour(input),
    onSuccess: (tour) => {
      invalidate();
      toast.success(`"${tour.name}" created`);
    },
    onError: (err) => toast.error(errorMessage(err)),
  });
}

export function useUpdateTour(id: string) {
  const invalidate = useInvalidateTours();
  return useMutation({
    mutationFn: (input: TourInput) => updateTour(id, input),
    onSuccess: (tour) => {
      invalidate();
      toast.success(`"${tour.name}" saved`);
    },
    onError: (err) => toast.error(errorMessage(err)),
  });
}

export function useSetTourPublished() {
  const invalidate = useInvalidateTours();
  return useMutation({
    mutationFn: (v: { id: string; published: boolean }) => setTourPublished(v.id, v.published),
    onSuccess: (tour) => {
      invalidate();
      toast.success(tour.published ? `"${tour.name}" is now published` : `"${tour.name}" was unpublished`);
    },
    onError: (err) => toast.error(errorMessage(err)),
  });
}

export function useSetTourFeatured() {
  const invalidate = useInvalidateTours();
  return useMutation({
    mutationFn: (v: { id: string; featured: boolean }) => setTourFeatured(v.id, v.featured),
    onSuccess: (tour) => {
      invalidate();
      toast.success(tour.featured ? `"${tour.name}" is now featured` : `"${tour.name}" is no longer featured`);
    },
    onError: (err) => toast.error(errorMessage(err)),
  });
}

export function useDeleteTour() {
  const invalidate = useInvalidateTours();
  return useMutation({
    mutationFn: (id: string) => deleteTour(id),
    onSuccess: () => {
      invalidate();
      toast.success("Tour deleted");
    },
    onError: (err) => toast.error(errorMessage(err)),
  });
}
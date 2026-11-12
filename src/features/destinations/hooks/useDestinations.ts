import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast/Toaster";
import {
  createDestination,
  deleteDestination,
  getDestination,
  listDestinations,
  setDestinationFeatured,
  setDestinationPublished,
  updateDestination,
} from "@/features/destinations/services/destinationService";
import { ApiError } from "@/services/api-error";
import { queryKeys } from "@/services/query-keys";
import type { DestinationFilters, DestinationInput } from "@/types/destination";

const errorMessage = (err: unknown) => (err instanceof Error ? err.message : "Something went wrong.");

export function useDestinations(filters: DestinationFilters) {
  return useQuery({
    queryKey: queryKeys.destinations.list(JSON.stringify(filters)),
    queryFn: () => listDestinations(filters),
    placeholderData: keepPreviousData,
  });
}

export function useDestination(id: string) {
  return useQuery({
    queryKey: queryKeys.destinations.detail(id),
    queryFn: () => getDestination(id),
    retry: (count, err) => !(err instanceof ApiError && err.status === 404) && count < 1,
  });
}

/** Destination changes can also change tours (renames), so refresh both. */
function useInvalidate() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: queryKeys.destinations.all });
    qc.invalidateQueries({ queryKey: queryKeys.tours.all });
  };
}

export function useCreateDestination() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (input: DestinationInput) => createDestination(input),
    onSuccess: (d) => {
      invalidate();
      toast.success(`"${d.name}" created`);
    },
    onError: (err) => toast.error(errorMessage(err)),
  });
}

export function useUpdateDestination(id: string) {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (input: DestinationInput) => updateDestination(id, input),
    onSuccess: (d) => {
      invalidate();
      toast.success(`"${d.name}" saved`);
    },
    onError: (err) => toast.error(errorMessage(err)),
  });
}

export function useSetDestinationPublished() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (v: { id: string; published: boolean }) => setDestinationPublished(v.id, v.published),
    onSuccess: (d) => {
      invalidate();
      toast.success(d.published ? `"${d.name}" is now published` : `"${d.name}" was unpublished`);
    },
    onError: (err) => toast.error(errorMessage(err)),
  });
}

export function useSetDestinationFeatured() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (v: { id: string; featured: boolean }) => setDestinationFeatured(v.id, v.featured),
    onSuccess: (d) => {
      invalidate();
      toast.success(d.featured ? `"${d.name}" is now featured` : `"${d.name}" is no longer featured`);
    },
    onError: (err) => toast.error(errorMessage(err)),
  });
}

export function useDeleteDestination() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: string) => deleteDestination(id),
    onSuccess: () => {
      invalidate();
      toast.success("Destination deleted");
    },
    onError: (err) => toast.error(errorMessage(err)),
  });
}